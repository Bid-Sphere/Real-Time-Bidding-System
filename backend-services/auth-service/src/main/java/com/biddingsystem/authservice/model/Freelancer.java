package com.biddingsystem.authservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Freelancer
{
    private Long id;
    private Long userId;
    private String professionalTitle;
    private List<String> skills;
    private String experienceLevel; // beginner, intermediate, expert
    private Double hourlyRate;
    private String portfolioUrl;
    private String bio;
    private Integer totalProjects;
    private Double rating;
    private String resumeUrl;
}
