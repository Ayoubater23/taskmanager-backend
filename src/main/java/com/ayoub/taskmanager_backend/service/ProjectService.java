package com.ayoub.taskmanager_backend.service;

import com.ayoub.taskmanager_backend.dto.projectdto.CreateProjectRequestDTO;
import com.ayoub.taskmanager_backend.dto.projectdto.ProjectResponseDTO;
import com.ayoub.taskmanager_backend.exception.AccessDeniedException;
import com.ayoub.taskmanager_backend.exception.ResourceNotFoundException;
import com.ayoub.taskmanager_backend.model.Project;
import com.ayoub.taskmanager_backend.model.User;
import com.ayoub.taskmanager_backend.repository.ProjectRepository;
import com.ayoub.taskmanager_backend.repository.TaskRepository;
import com.ayoub.taskmanager_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository,
                          TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }
    public ProjectResponseDTO createProject(CreateProjectRequestDTO dto, int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Project project = new Project(dto.title(), dto.description(), LocalDateTime.now());
        project.setUser(user);

        Project saved = projectRepository.save(project);
        return mapToProjectResponseDTO(saved);
    }

    public List<ProjectResponseDTO> getAllProjects(int userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return projectRepository.findByUser(user)
                .stream()
                .map(this::mapToProjectResponseDTO)
                .collect(Collectors.toList());
    }
    public ProjectResponseDTO getProjectById(int projectId,int userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        if (project.getUser().getId()!=userId) {
            throw new AccessDeniedException("Access denied");
        }
        return mapToProjectResponseDTO(project);
    }
    public void deleteProjectById(int projectId,int userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        if (project.getUser().getId()!=userId) {
            throw new AccessDeniedException("Access denied");
        }
        projectRepository.deleteById(projectId);
    }
    public ProjectResponseDTO mapToProjectResponseDTO(Project project) {
        int totalTasks=taskRepository.countByProject_Id(project.getId());
        int completedTasks=taskRepository.countByProject_IdAndCompletedTrue(project.getId());
        double progress = totalTasks == 0 ? 0 : (completedTasks * 100.0 / totalTasks);
        return new ProjectResponseDTO(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getCreatedAt(),
                totalTasks,
                completedTasks,
                progress
        );
    }
}
