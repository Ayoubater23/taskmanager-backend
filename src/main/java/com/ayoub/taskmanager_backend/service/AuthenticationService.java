package com.ayoub.taskmanager_backend.service;

import com.ayoub.taskmanager_backend.dto.userdto.LoginRequestDTO;
import com.ayoub.taskmanager_backend.dto.userdto.LoginResponseDTO;
import com.ayoub.taskmanager_backend.dto.userdto.RegisterRequestDTO;
import com.ayoub.taskmanager_backend.exception.DuplicateResourceException;
import com.ayoub.taskmanager_backend.model.User;
import com.ayoub.taskmanager_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponseDTO register(RegisterRequestDTO request) {

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new DuplicateResourceException("Email already in use");
        }
        var user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setProjects(new ArrayList<>());

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);

        return new LoginResponseDTO(jwtToken,user.getId());
    }

    public LoginResponseDTO login(LoginRequestDTO request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );
        var user = userRepository.findByEmail(request.email())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return new LoginResponseDTO(jwtToken,user.getId());

    }

}
