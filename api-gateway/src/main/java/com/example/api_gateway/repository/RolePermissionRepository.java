package com.example.api_gateway.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;
import java.util.Optional;
import com.example.api_gateway.entity.RolePermission;
import org.springframework.stereotype.Repository;
// RolePermissionRepository.java
@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Integer> {
    // Lấy tất cả quyền của một Role cụ thể
    List<RolePermission> findByRolecode(String roleCode);

	boolean existsByRolecodeAndApiendpointAndHttpmethod(String roleCode, String apiEndpoint, String httpMethod);
}