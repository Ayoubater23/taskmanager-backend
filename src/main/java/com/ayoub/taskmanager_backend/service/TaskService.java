package com.ayoub.taskmanager_backend.service;

import com.ayoub.taskmanager_backend.dto.taskdto.CreateTaskRequestDTO;
import com.ayoub.taskmanager_backend.dto.taskdto.TaskResponseDTO;
import com.ayoub.taskmanager_backend.dto.taskdto.UpdateTaskRequestDTO;
import com.ayoub.taskmanager_backend.exception.AccessDeniedException;
import com.ayoub.taskmanager_backend.exception.ResourceNotFoundException;
import com.ayoub.taskmanager_backend.model.Project;
import com.ayoub.taskmanager_backend.model.Task;
import com.ayoub.taskmanager_backend.repository.ProjectRepository;
import com.ayoub.taskmanager_backend.repository.TaskRepository;
import com.ayoub.taskmanager_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }
    public TaskResponseDTO createTask(int projectId, int userId, CreateTaskRequestDTO dto) {
        Project project = getProjectForUser(projectId, userId);
        Task task = new Task(dto.title(),dto.description(),dto.dueDate(),false);
        task.setProject(project);
        return mapToTaskResponseDTO(taskRepository.save(task));
    }
    public List<TaskResponseDTO> getAllTasks(int projectId, int userId) {
        Project project = getProjectForUser(projectId, userId);
        return taskRepository.findByProjectId(project.getId())
                .stream()
                .map(this::mapToTaskResponseDTO)
                .collect(Collectors.toList());
    }
    public void  deleteTask(int taskId,int userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(()-> new ResourceNotFoundException("task not found wth ID"+taskId));
        if (task.getProject().getUser().getId() != userId) {
            throw new AccessDeniedException("Access denied");
        }
        taskRepository.delete(task);
    }
    public TaskResponseDTO markTaskCompleted(int taskId, int userId){
        Task task = taskRepository.findById(taskId)
                .orElseThrow(()-> new ResourceNotFoundException("task not found wth ID"+taskId));
        if (task.getProject().getUser().getId() != userId) {
            throw new AccessDeniedException("Access denied");
        }
        task.setCompleted(true);
        Task updatedTask = taskRepository.save(task);
        return mapToTaskResponseDTO(updatedTask);
    }
    public TaskResponseDTO updateTask(int taskId, int userId, UpdateTaskRequestDTO dto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(()-> new ResourceNotFoundException("task not found wth ID"+taskId));

        if (task.getProject().getUser().getId() != userId) {
            throw new AccessDeniedException("Access denied");
        }

        if (dto.title() != null) {
            task.setTitle(dto.title());
        }
        if (dto.description() != null) {
            task.setDescription(dto.description());
        }
        if (dto.dueDate() != null) {
            task.setDueDate(dto.dueDate());
        }
        if (dto.completed() != null) {
            task.setCompleted(dto.completed());
        }

        Task updatedTask = taskRepository.save(task);
        return mapToTaskResponseDTO(updatedTask);
    }
    public List<TaskResponseDTO> searchTasks(int projectId, int userId, String title, String description,
                                             Boolean completed, LocalDateTime dueDateFrom, LocalDateTime dueDateTo)
    {
        Project project = getProjectForUser(projectId, userId);
        String safeTitle = (title != null && title.isEmpty()) ? null : title;
        String safeDescription = (description != null && description.isEmpty()) ? null : description;
         return taskRepository.searchTasks(
                    project.getId(),
                    safeTitle,
                    safeDescription,
                    completed,
                    dueDateFrom,
                    dueDateTo
            )
            .stream()
            .map(this::mapToTaskResponseDTO)
            .collect(Collectors.toList());
    }


    public Project getProjectForUser(int projectId, int userId) {
        Project project = projectRepository.findById(projectId).orElseThrow(()->new ResourceNotFoundException("Project not found with Id"+projectId));
        if (project.getUser().getId() != userId) {
            throw new AccessDeniedException("Access denied");
        }
        return project;
    }
    public TaskResponseDTO mapToTaskResponseDTO(Task task) {
        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.isCompleted()
        );
    }
}
