package org.ceagap.service;

import java.util.List;


/** Fixed content of the site: community activities and the list of green pledges. */
public final class Catalog {
    private Catalog() {}

    public record Activity(String id, String name, String title, String date, String icon, String description) {}
    public record Pledge(int id, String en, String te) {}

    public static final List<Activity> ACTIVITIES = List.of(
        new Activity("tree-plantation", "Tree Plantation", "Tree Plantation Drive", "2026-09-15", "🌳", "Plant and care for native trees in community spaces."),
        new Activity("water-conservation", "Water Conservation", "Water Conservation", "2026-09-20", "💧", "Learn and practice water saving and rainwater harvesting."),
        new Activity("waste-segregation", "Waste Segregation", "Waste Segregation", "2026-09-25", "♻️", "Practice separating wet, dry and recyclable waste correctly."),
        new Activity("plastic-reduction", "Plastic Reduction", "Plastic-Free Campaign", "2026-10-02", "🚫", "Reduce single-use plastic and encourage reusable alternatives."),
        new Activity("community-cleanup", "Community Clean-up", "Village Clean-up", "2026-10-10", "🧹", "Clean public spaces and help maintain a healthy community."),
        new Activity("environmental-awareness", "Environmental Awareness", "Awareness Program", "2026-10-15", "📢", "Share practical environmental awareness with citizens and students.")
    );

    public static final List<Pledge> PLEDGES = List.of(
        new Pledge(1, "I will not waste water.", "నేను నీటిని వృథా చేయను."),
        new Pledge(2, "I will reduce single-use plastic.", "నేను ఒక్కసారి ఉపయోగించే ప్లాస్టిక్‌ను తగ్గిస్తాను."),
        new Pledge(3, "I will segregate waste properly.", "నేను వ్యర్థాలను సరిగ్గా వేరు చేస్తాను."),
        new Pledge(4, "I will plant and protect trees.", "నేను చెట్లను నాటి సంరక్షిస్తాను."),
        new Pledge(5, "I will save electricity and energy.", "నేను విద్యుత్ మరియు శక్తిని ఆదా చేస్తాను."),
        new Pledge(6, "I will keep my surroundings clean.", "నేను నా పరిసరాలను పరిశుభ్రంగా ఉంచుతాను."),
        new Pledge(7, "I will encourage others to protect the environment.", "నేను ఇతరులను పర్యావరణాన్ని రక్షించేందుకు ప్రోత్సహిస్తాను.")
    );

    public static String badge(int score) {
        return switch (score) {
            case 5 -> "Green Champion";
            case 4 -> "Eco Expert";
            case 3 -> "Green Leader";
            case 2 -> "Eco Learner";
            default -> "Eco Starter";
        };
    }

}
