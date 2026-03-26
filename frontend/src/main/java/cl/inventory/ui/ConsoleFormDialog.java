package cl.inventory.ui;

import cl.inventory.model.Console;
import cl.inventory.model.Platform;

import javax.swing.*;
import java.awt.*;
import java.util.List;

public class ConsoleFormDialog extends JDialog {
    private JComboBox<Platform> platformCombo;
    private JTextField modelField;
    private JTextField serialField;
    private JTextField colorField;
    private JComboBox<String> statusCombo;
    private JTextField storageField;
    private JTextField cablesField;

    private boolean approved = false;
    private Console resultConsole;

    public ConsoleFormDialog(Frame owner, List<Platform> platforms) {
        this(owner, platforms, null);
    }

    public ConsoleFormDialog(Frame owner, List<Platform> platforms, Console existing) {
        super(owner, existing == null ? "Add New Console" : "Edit Console", true);
        setLayout(new BorderLayout());

        JPanel formPanel = new JPanel(new GridLayout(7, 2, 10, 10));
        formPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        formPanel.add(new JLabel("Platform Base*:"));
        platformCombo = new JComboBox<>(platforms.toArray(new Platform[0]));
        formPanel.add(platformCombo);

        formPanel.add(new JLabel("Model Name (e.g., Slim, Pro):*"));
        modelField = new JTextField();
        formPanel.add(modelField);

        formPanel.add(new JLabel("Serial Number:"));
        serialField = new JTextField();
        formPanel.add(serialField);
        
        formPanel.add(new JLabel("Color / Edition:"));
        colorField = new JTextField();
        formPanel.add(colorField);

        formPanel.add(new JLabel("Operating Status:"));
        statusCombo = new JComboBox<>(new String[]{"Functional", "Needs Repair", "Broken", "Display Only"});
        formPanel.add(statusCombo);
        
        formPanel.add(new JLabel("Storage Capacity:"));
        storageField = new JTextField("e.g. 500GB, 1TB");
        formPanel.add(storageField);
        
        formPanel.add(new JLabel("Included Cables/Mods:"));
        cablesField = new JTextField("e.g. HDMI, Power, Modchip");
        formPanel.add(cablesField);

        add(formPanel, BorderLayout.CENTER);

        if (existing != null) {
            for (int i = 0; i < platformCombo.getItemCount(); i++) {
                if (platformCombo.getItemAt(i).getId() == existing.getPlatformId()) {
                    platformCombo.setSelectedIndex(i);
                    break;
                }
            }
            modelField.setText(existing.getModel());
            serialField.setText(existing.getSerialNumber());
            colorField.setText(existing.getColorEdition());
            statusCombo.setSelectedItem(existing.getStatus());
            storageField.setText(existing.getStorageCapacity());
            cablesField.setText(existing.getIncludedCables());
            this.resultConsole = existing;
        }

        JPanel btnPanel = new JPanel();
        JButton saveBtn = new JButton("Save Console");
        saveBtn.addActionListener(e -> {
            if (modelField.getText().trim().isEmpty() || platformCombo.getSelectedItem() == null) {
                JOptionPane.showMessageDialog(this, "Platform and Model Name are required.", "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
            buildResult();
            approved = true;
            dispose();
        });
        JButton cancelBtn = new JButton("Cancel");
        cancelBtn.addActionListener(e -> dispose());

        btnPanel.add(saveBtn);
        btnPanel.add(cancelBtn);
        add(btnPanel, BorderLayout.SOUTH);

        pack();
        setLocationRelativeTo(owner);
    }

    private void buildResult() {
        if (resultConsole == null) resultConsole = new Console();
        resultConsole.setPlatformId(((Platform) platformCombo.getSelectedItem()).getId());
        resultConsole.setModel(modelField.getText().trim());
        resultConsole.setSerialNumber(serialField.getText().trim());
        resultConsole.setColorEdition(colorField.getText().trim());
        resultConsole.setStatus(statusCombo.getSelectedItem().toString());
        resultConsole.setStorageCapacity(storageField.getText().trim());
        resultConsole.setIncludedCables(cablesField.getText().trim());
    }

    public boolean isApproved() { return approved; }
    public Console getResultConsole() { return resultConsole; }
}
