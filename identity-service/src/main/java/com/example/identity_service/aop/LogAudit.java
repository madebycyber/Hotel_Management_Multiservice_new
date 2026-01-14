package com.example.identity_service.aop;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD) // Chỉ dùng cho Method
@Retention(RetentionPolicy.RUNTIME) // Tồn tại lúc chạy
public @interface LogAudit {
    String action(); // Tên hành động (VD: CREATE_USER)
    String description() default ""; // Mô tả thêm (VD: User details...)
}