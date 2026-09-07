package cl.inventory.ui;

import cl.inventory.model.VideoGame;
import cl.inventory.model.VideoGameRating;

import javax.swing.*;
import java.awt.*;

public class RatingFormDialog extends JDialog {
    private JComboBox<String> ratingCombo;   // "Sin valoración", "1".."5"
    private JCheckBox completedCheck;
    private JSpinner progressSpinner;
    private JSpinner timesCompletedSpinner;
    private JTextField lastPlayedField;
    private JTextArea commentArea;

    private boolean approved = false;
    private VideoGameRating resultRating;
    private final int videoGameId;

    private static final String NO_RATING = "Sin valoración";

    public RatingFormDialog(Frame owner, VideoGame game, VideoGameRating existing) {
        super(owner, "Rating / Progreso: " + (game != null ? game.getTitle() : ""), true);
        this.videoGameId = game != null ? game.getId() : (existing != null ? existing.getVideoGameId() : 0);
        setLayout(new BorderLayout());

        JPanel formPanel = new JPanel(new GridLayout(6, 2, 10, 10));
        formPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        formPanel.add(new JLabel("Rating:"));
        ratingCombo = new JComboBox<>(new String[]{NO_RATING, "1", "2", "3", "4", "5"});
        formPanel.add(ratingCombo);

        formPanel.add(new JLabel("Completado:"));
        completedCheck = new JCheckBox();
        formPanel.add(completedCheck);

        formPanel.add(new JLabel("Avance % (si no está completado):"));
        progressSpinner = new JSpinner(new SpinnerNumberModel(0, 0, 100, 5));
        formPanel.add(progressSpinner);

        formPanel.add(new JLabel("Veces terminado:"));
        timesCompletedSpinner = new JSpinner(new SpinnerNumberModel(0, 0, 9999, 1));
        formPanel.add(timesCompletedSpinner);

        formPanel.add(new JLabel("Última vez jugado (YYYY-MM-DD):"));
        lastPlayedField = new JTextField();
        formPanel.add(lastPlayedField);

        formPanel.add(new JLabel("Comentario:"));
        commentArea = new JTextArea(4, 20);
        commentArea.setLineWrap(true);
        commentArea.setWrapStyleWord(true);
        formPanel.add(new JScrollPane(commentArea));

        add(formPanel, BorderLayout.CENTER);

        // Si está completado, el avance parcial no aplica.
        completedCheck.addActionListener(e -> progressSpinner.setEnabled(!completedCheck.isSelected()));

        if (existing != null) {
            if (existing.getRating() != null) {
                ratingCombo.setSelectedItem(String.valueOf(existing.getRating()));
            } else {
                ratingCombo.setSelectedItem(NO_RATING);
            }
            completedCheck.setSelected(existing.isCompleted());
            progressSpinner.setValue(existing.getProgressPercent());
            progressSpinner.setEnabled(!existing.isCompleted());
            timesCompletedSpinner.setValue(existing.getTimesCompleted());
            if (existing.getLastPlayed() != null) lastPlayedField.setText(existing.getLastPlayed());
            if (existing.getComment() != null) commentArea.setText(existing.getComment());
        }

        JPanel btnPanel = new JPanel();
        JButton saveBtn = new JButton("Guardar");
        saveBtn.addActionListener(e -> {
            if (buildResult()) {
                approved = true;
                dispose();
            }
        });
        JButton cancelBtn = new JButton("Cancelar");
        cancelBtn.addActionListener(e -> dispose());

        btnPanel.add(saveBtn);
        btnPanel.add(cancelBtn);
        add(btnPanel, BorderLayout.SOUTH);

        pack();
        setLocationRelativeTo(owner);
    }

    private boolean buildResult() {
        VideoGameRating r = new VideoGameRating();
        r.setVideoGameId(videoGameId);

        String ratingSel = (String) ratingCombo.getSelectedItem();
        if (NO_RATING.equals(ratingSel)) {
            r.setRating(null);
        } else {
            r.setRating(Integer.parseInt(ratingSel));
        }

        boolean completed = completedCheck.isSelected();
        r.setCompleted(completed);
        int progress = (Integer) progressSpinner.getValue();
        if (progress < 0 || progress > 100) {
            JOptionPane.showMessageDialog(this, "El avance debe estar entre 0 y 100.", "Error", JOptionPane.ERROR_MESSAGE);
            return false;
        }
        // Si está completado, el avance se considera 100 (lo normaliza también el backend).
        r.setProgressPercent(completed ? 100 : progress);
        r.setTimesCompleted((Integer) timesCompletedSpinner.getValue());
        r.setLastPlayed(lastPlayedField.getText().trim());
        r.setComment(commentArea.getText().trim());

        this.resultRating = r;
        return true;
    }

    public boolean isApproved() {
        return approved;
    }

    public VideoGameRating getResultRating() {
        return resultRating;
    }
}
