package cl.inventory.ui;

import org.jdesktop.swingx.JXFrame;
import org.jdesktop.swingx.JXTable;
import org.jdesktop.swingx.JXTaskPane;
import org.jdesktop.swingx.JXTaskPaneContainer;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.net.URL;
import java.util.List;
import javax.xml.namespace.QName;
import javax.xml.ws.Service;

import cl.inventory.service.InventoryService;
import cl.inventory.model.VideoGame;
import cl.inventory.model.Platform;
import cl.inventory.model.Accessory;
import cl.inventory.model.Console;

public class MainFrame extends JXFrame {
    
    private InventoryService service;
    
    private JXTable gameTable;
    private DefaultTableModel gameTableModel;
    private JXTable platformTable;
    private DefaultTableModel platformTableModel;
    private JXTable accessoryTable;
    private DefaultTableModel accessoryTableModel;
    private JXTable consoleTable;
    private DefaultTableModel consoleTableModel;
    private JTextArea dashboardArea;

    private List<VideoGame> currentGames;
    private List<Platform> currentPlatforms;
    private List<Accessory> currentAccessories;
    private List<Console> currentConsoles;

    public MainFrame() {
        super("Slam's Video Game Inventory", true);
        setSize(1100, 800);
        setLocationRelativeTo(null);
        initService();
        initComponents();
        loadData();
    }
    
    private void initService() {
        try {
            URL url = new URL("http://localhost:8080/inventory/ws/inventory?wsdl");
            QName qname = new QName("http://service.inventory.cl/", "InventoryServiceImplService");
            Service wsService = Service.create(url, qname);
            service = wsService.getPort(InventoryService.class);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Backend is not ready yet, working in offline mode.");
        }
    }
    
    private void initComponents() {
        setLayout(new BorderLayout());
        
        JXTaskPaneContainer taskPaneContainer = new JXTaskPaneContainer();
        
        // --- VIDEO GAMES PANE ---
        JXTaskPane gamePane = new JXTaskPane();
        gamePane.setTitle("Video Games Actions");
        gamePane.add(new AbstractAction("Refresh Data") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) { loadData(); }
        });
        gamePane.add(new AbstractAction("Add Game") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                if(service == null) return;
                try {
                    List<cl.inventory.model.Platform> platforms = service.getAllPlatforms();
                    if (platforms == null || platforms.isEmpty()) { JOptionPane.showMessageDialog(MainFrame.this, "Add a platform first."); return; }
                    GameFormDialog dialog = new GameFormDialog(MainFrame.this, platforms); dialog.setVisible(true);
                    if (dialog.isApproved()) { service.addVideoGame(dialog.getResultGame()); loadData(); }
                } catch(Exception ex) { ex.printStackTrace(); }
            }
        });
        gamePane.add(new AbstractAction("Edit Game") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                if(service == null || currentGames == null) return;
                int row = gameTable.getSelectedRow(); if(row < 0) return;
                int modelRow = gameTable.convertRowIndexToModel(row); VideoGame sel = currentGames.get(modelRow);
                try {
                    List<cl.inventory.model.Platform> platforms = service.getAllPlatforms();
                    GameFormDialog dialog = new GameFormDialog(MainFrame.this, platforms, sel); dialog.setVisible(true);
                    if (dialog.isApproved()) { service.updateVideoGame(dialog.getResultGame()); loadData(); }
                } catch(Exception ex) { ex.printStackTrace(); }
            }
        });
        gamePane.add(new AbstractAction("Delete Game") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                if(service == null || currentGames == null) return;
                int row = gameTable.getSelectedRow(); if(row < 0) return;
                VideoGame sel = currentGames.get(gameTable.convertRowIndexToModel(row));
                if (JOptionPane.showConfirmDialog(MainFrame.this, "Delete " + sel.getTitle() + "?", "Confirm", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION) {
                    try { service.deleteVideoGame(sel.getId()); loadData(); } catch(Exception ex) { ex.printStackTrace(); }
                }
            }
        });
        
        // --- PLATFORMS PANE ---
        JXTaskPane platformPane = new JXTaskPane();
        platformPane.setTitle("Platforms Actions");
        platformPane.add(new AbstractAction("Refresh Data") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) { loadData(); }
        });
        platformPane.add(new AbstractAction("Add Platform") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                String name = JOptionPane.showInputDialog("Enter Platform Name:");
                if(name != null && !name.trim().isEmpty() && service != null) {
                    cl.inventory.model.Platform p = new cl.inventory.model.Platform(); p.setName(name);
                    try { service.addPlatform(p); loadData(); } catch(Exception ex) { ex.printStackTrace(); }
                }
            }
        });
        platformPane.add(new AbstractAction("Edit Platform") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                if(service == null || currentPlatforms == null) return;
                int row = platformTable.getSelectedRow(); if(row < 0) return;
                cl.inventory.model.Platform sel = currentPlatforms.get(platformTable.convertRowIndexToModel(row));
                String name = (String) JOptionPane.showInputDialog(MainFrame.this, "Edit Platform Name:", "Edit Platform", JOptionPane.QUESTION_MESSAGE, null, null, sel.getName());
                if(name != null && !name.trim().isEmpty()) {
                    sel.setName(name); try { service.updatePlatform(sel); loadData(); } catch(Exception ex) { ex.printStackTrace(); }
                }
            }
        });
        platformPane.add(new AbstractAction("Delete Platform") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                if(service == null || currentPlatforms == null) return;
                int row = platformTable.getSelectedRow(); if(row < 0) return;
                cl.inventory.model.Platform sel = currentPlatforms.get(platformTable.convertRowIndexToModel(row));
                if (JOptionPane.showConfirmDialog(MainFrame.this, "Delete " + sel.getName() + "?", "Confirm", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION) {
                    try { service.deletePlatform(sel.getId()); loadData(); } catch(Exception ex) { JOptionPane.showMessageDialog(MainFrame.this, "Ensure no games/hardware are linked to it.", "Error", JOptionPane.ERROR_MESSAGE); }
                }
            }
        });

        // --- CONSOLES PANE ---
        JXTaskPane consolePane = new JXTaskPane();
        consolePane.setTitle("Consoles Actions");
        consolePane.add(new AbstractAction("Refresh Data") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) { loadData(); }
        });
        consolePane.add(new AbstractAction("Add Hardware") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                if(service == null) return;
                try {
                    List<cl.inventory.model.Platform> platforms = service.getAllPlatforms();
                    if (platforms == null || platforms.isEmpty()) { JOptionPane.showMessageDialog(MainFrame.this, "Add a platform base first."); return; }
                    ConsoleFormDialog dialog = new ConsoleFormDialog(MainFrame.this, platforms); dialog.setVisible(true);
                    if(dialog.isApproved()) { service.addConsole(dialog.getResultConsole()); loadData(); }
                } catch(Exception ex) { ex.printStackTrace(); }
            }
        });
        consolePane.add(new AbstractAction("Edit Hardware") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                if(service == null || currentConsoles == null) return;
                int row = consoleTable.getSelectedRow(); if(row < 0) return;
                Console sel = currentConsoles.get(consoleTable.convertRowIndexToModel(row));
                try {
                    List<cl.inventory.model.Platform> platforms = service.getAllPlatforms();
                    ConsoleFormDialog dialog = new ConsoleFormDialog(MainFrame.this, platforms, sel); dialog.setVisible(true);
                    if(dialog.isApproved()) { service.updateConsole(dialog.getResultConsole()); loadData(); }
                } catch(Exception ex) { ex.printStackTrace(); }
            }
        });
        consolePane.add(new AbstractAction("Delete Hardware") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                if(service == null || currentConsoles == null) return;
                int row = consoleTable.getSelectedRow(); if(row < 0) return;
                Console sel = currentConsoles.get(consoleTable.convertRowIndexToModel(row));
                if (JOptionPane.showConfirmDialog(MainFrame.this, "Delete " + sel.getModel() + "?", "Confirm", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION) {
                    try { service.deleteConsole(sel.getId()); loadData(); } catch(Exception ex) { ex.printStackTrace(); }
                }
            }
        });

        // --- ACCESSORIES PANE ---
        JXTaskPane accessoryPane = new JXTaskPane();
        accessoryPane.setTitle("Accessories Actions");
        accessoryPane.add(new AbstractAction("Refresh Data") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) { loadData(); }
        });
        accessoryPane.add(new AbstractAction("Add Accessory") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                if(service == null) return;
                AccessoryFormDialog dialog = new AccessoryFormDialog(MainFrame.this); dialog.setVisible(true);
                if(dialog.isApproved()) { try { service.addAccessory(dialog.getResultAccessory()); loadData(); } catch(Exception ex){ ex.printStackTrace(); } }
            }
        });
        accessoryPane.add(new AbstractAction("Edit Accessory") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                if(service == null || currentAccessories == null) return;
                int row = accessoryTable.getSelectedRow(); if(row < 0) return;
                Accessory sel = currentAccessories.get(accessoryTable.convertRowIndexToModel(row));
                AccessoryFormDialog dialog = new AccessoryFormDialog(MainFrame.this, sel); dialog.setVisible(true);
                if (dialog.isApproved()) { try { service.updateAccessory(dialog.getResultAccessory()); loadData(); } catch(Exception ex){ ex.printStackTrace(); } }
            }
        });
        accessoryPane.add(new AbstractAction("Delete Accessory") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) {
                if(service == null || currentAccessories == null) return;
                int row = accessoryTable.getSelectedRow(); if(row < 0) return;
                Accessory sel = currentAccessories.get(accessoryTable.convertRowIndexToModel(row));
                if (JOptionPane.showConfirmDialog(MainFrame.this, "Delete accessory '" + sel.getBrand() + "'?", "Confirm", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION) {
                    try { service.deleteAccessory(sel.getId()); loadData(); } catch(Exception ex) { ex.printStackTrace(); }
                }
            }
        });
        
        // --- DASHBOARD PANE ---
        JXTaskPane dashboardPane = new JXTaskPane();
        dashboardPane.setTitle("Dashboard Actions");
        dashboardPane.add(new AbstractAction("Reload Statistics") {
            @Override public void actionPerformed(java.awt.event.ActionEvent e) { loadData(); }
        });

        taskPaneContainer.add(gamePane);
        taskPaneContainer.add(platformPane);
        taskPaneContainer.add(consolePane);
        taskPaneContainer.add(accessoryPane);
        taskPaneContainer.add(dashboardPane);
        
        gamePane.setVisible(true);
        platformPane.setVisible(false);
        consolePane.setVisible(false);
        accessoryPane.setVisible(false);
        dashboardPane.setVisible(false);
        
        add(new JScrollPane(taskPaneContainer), BorderLayout.WEST);
        
        // --- TABS & TABLES ---
        JTabbedPane tabbedPane = new JTabbedPane();
        
        // 1. Dashboard Tab
        JPanel dashPanel = new JPanel(new BorderLayout());
        dashboardArea = new JTextArea("Loading statistics...");
        dashboardArea.setEditable(false);
        dashboardArea.setFont(new Font("Monospaced", Font.BOLD, 15));
        dashboardArea.setBackground(new Color(245, 245, 245));
        dashboardArea.setMargin(new Insets(20, 20, 20, 20));
        dashPanel.add(new JScrollPane(dashboardArea), BorderLayout.CENTER);
        tabbedPane.addTab("Dashboard", dashPanel);
        
        // 2. Games Tab
        JPanel gamePanel = new JPanel(new BorderLayout());
        String[] columns = {"ID", "Title", "Platform", "Format", "State"};
        gameTableModel = new DefaultTableModel(columns, 0);
        gameTable = new JXTable(gameTableModel); gameTable.setColumnControlVisible(true); gameTable.packAll();
        gamePanel.add(new JScrollPane(gameTable), BorderLayout.CENTER);
        tabbedPane.addTab("Video Games", gamePanel);
        
        // 3. Platforms Tab
        JPanel platformPanel = new JPanel(new BorderLayout());
        String[] pColumns = {"ID", "Name"};
        platformTableModel = new DefaultTableModel(pColumns, 0);
        platformTable = new JXTable(platformTableModel); platformTable.setColumnControlVisible(true); platformTable.packAll();
        platformPanel.add(new JScrollPane(platformTable), BorderLayout.CENTER);
        tabbedPane.addTab("Platforms", platformPanel);

        // 4. Consoles Tab
        JPanel consPanel = new JPanel(new BorderLayout());
        String[] cColumns = {"ID", "Platform", "Model", "Serial", "Color", "Status", "Storage", "Cables"};
        consoleTableModel = new DefaultTableModel(cColumns, 0);
        consoleTable = new JXTable(consoleTableModel); consoleTable.setColumnControlVisible(true); consoleTable.packAll();
        consPanel.add(new JScrollPane(consoleTable), BorderLayout.CENTER);
        tabbedPane.addTab("Hardware", consPanel);
        
        // 5. Accessories Tab
        JPanel accPanel = new JPanel(new BorderLayout());
        String[] aColumns = {"ID", "Type", "Brand", "Connectivity"};
        accessoryTableModel = new DefaultTableModel(aColumns, 0);
        accessoryTable = new JXTable(accessoryTableModel); accessoryTable.setColumnControlVisible(true); accessoryTable.packAll();
        accPanel.add(new JScrollPane(accessoryTable), BorderLayout.CENTER);
        tabbedPane.addTab("Accessories", accPanel);
        
        tabbedPane.addChangeListener(e -> {
            int idx = tabbedPane.getSelectedIndex();
            dashboardPane.setVisible(idx == 0);
            gamePane.setVisible(idx == 1);
            platformPane.setVisible(idx == 2);
            consolePane.setVisible(idx == 3);
            accessoryPane.setVisible(idx == 4);
        });
        
        add(tabbedPane, BorderLayout.CENTER);
        
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception e){}
    }
    
    private void loadData() {
        if(service == null) return;
        new SwingWorker<Void, Void>() {
            private List<VideoGame> games;
            private List<Platform> platforms;
            private List<Accessory> accessories;
            private List<Console> consoles;
            private String reportText;

            @Override
            protected Void doInBackground() throws Exception {
                games = service.getAllVideoGames();
                platforms = service.getAllPlatforms();
                accessories = service.getAllAccessories();
                consoles = service.getAllConsoles();
                try {
                    reportText = service.getStatisticsReport();
                } catch(Exception e) {
                    reportText = "Could not fetch stats.";
                }
                return null;
            }

            @Override
            protected void done() {
                try {
                    if (games != null) {
                        currentGames = games; gameTableModel.setRowCount(0);
                        for (VideoGame g : games) { gameTableModel.addRow(new Object[]{ g.getId(), g.getTitle(), g.getPlatform(), g.getFormat(), g.getPlayState() }); }
                        gameTable.packAll();
                    }
                    if (platforms != null) {
                        currentPlatforms = platforms; platformTableModel.setRowCount(0);
                        for (Platform p : platforms) { platformTableModel.addRow(new Object[]{ p.getId(), p.getName() }); }
                        platformTable.packAll();
                    }
                    if (consoles != null) {
                        currentConsoles = consoles; consoleTableModel.setRowCount(0);
                        for (Console c : consoles) { consoleTableModel.addRow(new Object[]{ c.getId(), c.getPlatformName(), c.getModel(), c.getSerialNumber(), c.getColorEdition(), c.getStatus(), c.getStorageCapacity(), c.getIncludedCables() }); }
                        consoleTable.packAll();
                    }
                    if (accessories != null) {
                        currentAccessories = accessories; accessoryTableModel.setRowCount(0);
                        for (Accessory a : accessories) { accessoryTableModel.addRow(new Object[]{ a.getId(), a.getType(), a.getBrand(), a.getConnectivity() }); }
                        accessoryTable.packAll();
                    }
                    if (reportText != null && dashboardArea != null) {
                        dashboardArea.setText(reportText);
                    }
                } catch (Exception e) { e.printStackTrace(); }
            }
        }.execute();
    }
}
