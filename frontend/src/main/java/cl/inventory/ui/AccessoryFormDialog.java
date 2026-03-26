package cl.inventory.ui;

import cl.inventory.model.Accessory;

import javax.swing.*;
import java.awt.*;

public class AccessoryFormDialog extends JDialog {
    private JTextField typeField;
    private JTextField brandField;
    private JComboBox<String> connectivityCombo;

    private boolean approved = false;
    private Accessory resultAccessory;

    public AccessoryFormDialog(Frame owner) {
        this(owner, null);
    }

    public AccessoryFormDialog(Frame owner, Accessory existing) {
        super(owner, existing == null ? "Add New Accessory" : "Edit Accessory", true);
        setLayout(new BorderLayout());

        JPanel formPanel = new JPanel(new GridLayout(3, 2, 10, 10));
        formPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        formPanel.add(new JLabel("Type (e.g., Controller, Headset):*"));
        typeField = new JTextField();
        formPanel.add(typeField);

        formPanel.add(new JLabel("Brand:*"));
        brandField = new JTextField();
        formPanel.add(brandField);

        formPanel.add(new JLabel("Connectivity:"));
        connectivityCombo = new JComboBox<>(new String[]{"Wired", "Wireless", "Bluetooth", "Proprietary", "Other"});
        formPanel.add(connectivityCombo);

        add(formPanel, BorderLayout.CENTER);

        if (existing != null) {
            typeField.setText(existing.getType());
            brandField.setText(existing.getBrand());
            connectivityCombo.setSelectedItem(existing.getConnectivity());
            this.resultAccessory = existing;
        }

        JPanel btnPanel = new JPanel();
        JButton saveBtn = new JButton("Save Accessory");
        saveBtn.addActionListener(e -> {
            if (typeField.getText().trim().isEmpty() || brandField.getText().trim().isEmpty()) {
                JOptionPane.showMessageDialog(this, "Type and Brand are required.", "Error", JOptionPane.ERROR_MESSAGE);
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
        if (resultAccessory == null) resultAccessory = new Accessory();
        resultAccessory.setType(typeField.getText().trim());
        resultAccessory.setBrand(brandField.getText().trim());
        resultAccessory.setConnectivity(connectivityCombo.getSelectedItem().toString());
    }

    public boolean isApproved() { return approved; }
    public Accessory getResultAccessory() { return resultAccessory; }
}
