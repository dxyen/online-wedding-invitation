package com.wedding.service;

import com.wedding.dto.request.LoginRequest;
import com.wedding.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
}
