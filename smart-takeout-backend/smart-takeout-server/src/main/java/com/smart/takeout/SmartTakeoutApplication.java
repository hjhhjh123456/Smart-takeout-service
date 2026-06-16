package com.smart.takeout;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * smart-takeout-service 启动类。
 *
 * 包名 com.smart.takeout 既是 Spring Boot 默认扫描根，
 * 也是 @MapperScan、@ComponentScan 等不需要显式 basePackages 的隐式扫描起点。
 */
@SpringBootApplication
@EnableTransactionManagement // 开启注解方式的事务管理
@Slf4j
@EnableCaching             // 开启缓存注解功能
@EnableScheduling          // 开启任务调度
public class SmartTakeoutApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartTakeoutApplication.class, args);
        log.info("smart-takeout-service started");
    }
}
