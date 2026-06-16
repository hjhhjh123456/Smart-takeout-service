package com.smart.takeout.service;

import com.smart.takeout.dto.EmployeeDTO;
import com.smart.takeout.dto.EmployeeLoginDTO;
import com.smart.takeout.dto.EmployeePageQueryDTO;
import com.smart.takeout.entity.Employee;
import com.smart.takeout.result.PageResult;

import java.util.List;

public interface EmployeeService {

    /**
     * 员工批量删除
     * @param ids
     * @return
     */
    void deleteBatch(List<Long> ids);

    /**
     * 员工登录
     * @param employeeLoginDTO
     * @return
     */
    Employee login(EmployeeLoginDTO employeeLoginDTO);

    /**
     * 新增员工
     * @param employeeDTO
     */
    void save(EmployeeDTO employeeDTO);

    /**
     * 分页查询
     * @param employeePageQueryDTO
     * @return
     */
    PageResult pageQuery(EmployeePageQueryDTO employeePageQueryDTO);

    /**
     * 启用禁用员工账号
     * @param status
     * @param id
     */
    void startOrStop(Integer status, Long id);

    /**
     * 根据id查询员工
     * @param id
     * @return
     */
    Employee getById(Long id);

    /**
     * 编辑员工信息
     * @param employeeDTO
     */
    void update(EmployeeDTO employeeDTO);
    /**
     * 新增配送员工信息
     * @param employeeDTO
     */
    void add_delivery_work(EmployeeDTO employeeDTO);

    /**
     * 批量删除配送员工信息
     * @param ids
     */
    void deleteBatchDeliveryWorkers(List<Long> ids);
}
