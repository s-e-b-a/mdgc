package cl.inventory.ui;

import cl.inventory.model.VideoGame;
import cl.inventory.model.Platform;

import javax.swing.*;
import java.awt.*;
import java.util.List;

public class GameFormDialog extends JDialog {
    private JTextField titleField;
    private JComboBox<Platform> platformCombo;
    private JComboBox<String> formatCombo;
    private JComboBox<String> completenessCombo;
    private JComboBox<String> regionCombo;
    private JTextField storeField;
    private JTextField priceField;
    private JTextField dateField;
    private JComboBox<String> stateCombo;

    private boolean approved = false;
    private VideoGame resultGame;

    public GameFormDialog(Frame owner, List<Platform> platforms) {
        this(owner, platforms, null);
    }

    public GameFormDialog(Frame owner, List<Platform> platforms, VideoGame existing) {
        super(owner, existing == null ? "Add New Game" : "Edit Game", true);
        setLayout(new BorderLayout());

        JPanel formPanel = new JPanel(new GridLayout(9, 2, 10, 10));
        formPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        formPanel.add(new JLabel("Title*:"));
        titleField = new JTextField();
        formPanel.add(titleField);

        formPanel.add(new JLabel("Platform*:"));
        platformCombo = new JComboBox<>(platforms.toArray(new Platform[0]));
        formPanel.add(platformCombo);

        formPanel.add(new JLabel("Format:"));
        formatCombo = new JComboBox<>(new String[]{"Physical", "Digital"});
        formPanel.add(formatCombo);

        formPanel.add(new JLabel("Completeness:"));
        completenessCombo = new JComboBox<>(new String[]{"New/Sealed", "CIB (Complete in Box)", "Game + Box", "Loose"});
        formPanel.add(completenessCombo);

        formPanel.add(new JLabel("Region:"));
        regionCombo = new JComboBox<>(new String[]{"NTSC-U", "PAL", "NTSC-J", "Region Free"});
        formPanel.add(regionCombo);

        formPanel.add(new JLabel("Store/Origin:"));
        storeField = new JTextField();
        formPanel.add(storeField);

        formPanel.add(new JLabel("Purchase Price:"));
        priceField = new JTextField("0.0");
        formPanel.add(priceField);

        formPanel.add(new JLabel("Acquisition Date (YYYY-MM-DD):"));
        dateField = new JTextField();
        formPanel.add(dateField);

        formPanel.add(new JLabel("Play State:"));
        stateCombo = new JComboBox<>(new String[]{"Unplayed", "Playing", "Beaten", "Completed", "Abandoned"});
        formPanel.add(stateCombo);

        add(formPanel, BorderLayout.CENTER);

        if (existing != null) {
            titleField.setText(existing.getTitle());
            for (int i = 0; i < platformCombo.getItemCount(); i++) {
                if (platformCombo.getItemAt(i).getId() == existing.getPlatformId()) {
                    platformCombo.setSelectedIndex(i);
                    break;
                }
            }
            if(existing.getFormat() != null) formatCombo.setSelectedItem(existing.getFormat());
            if(existing.getCompleteness() != null) completenessCombo.setSelectedItem(existing.getCompleteness());
            if(existing.getRegion() != null) regionCombo.setSelectedItem(existing.getRegion());
            if(existing.getStoreOrigin() != null) storeField.setText(existing.getStoreOrigin());
            priceField.setText(String.valueOf(existing.getPurchasePrice()));
            if(existing.getAcquisitionDate() != null) dateField.setText(existing.getAcquisitionDate());
            if(existing.getPlayState() != null) stateCombo.setSelectedItem(existing.getPlayState());
            this.resultGame = existing;
        }

        JPanel btnPanel = new JPanel();
        JButton saveBtn = new JButton("Save Game");
        saveBtn.addActionListener(e -> {
            if (titleField.getText().trim().isEmpty() || platformCombo.getSelectedItem() == null) {
                JOptionPane.showMessageDialog(this, "Title and Platform are required.", "Error", JOptionPane.ERROR_MESSAGE);
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
        if (resultGame == null) resultGame = new VideoGame();
        resultGame.setTitle(titleField.getText().trim());
        resultGame.setPlatformId(((Platform) platformCombo.getSelectedItem()).getId());
        resultGame.setFormat(formatCombo.getSelectedItem().toString());
        resultGame.setCompleteness(completenessCombo.getSelectedItem().toString());
        resultGame.setRegion(regionCombo.getSelectedItem().toString());
        resultGame.setStoreOrigin(storeField.getText().trim());
        try {
            resultGame.setPurchasePrice(Double.parseDouble(priceField.getText().trim()));
        } catch (Exception ex) {
            resultGame.setPurchasePrice(0.0);
        }
        resultGame.setAcquisitionDate(dateField.getText().trim());
        resultGame.setPlayState(stateCombo.getSelectedItem().toString());
    }

    public boolean isApproved() {
        return approved;
    }

    public VideoGame getResultGame() {
        return resultGame;
    }
}
