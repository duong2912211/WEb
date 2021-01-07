$(document).ready(function () {
    new EmployeeJS();
})

/**
 * Class quản lý các sự kiện cho Employee
 * CreateBy: Duong (4/1/2021)
 * */
class EmployeeJS extends BaseJS {
    constructor() {
        super();
    }
    setDataUrl() {
        this.getDataUrl = "http://api.manhnv.net/api/employees";
    }
}