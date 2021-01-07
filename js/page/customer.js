$(document).ready(function () {
    new CustomerJS();
})

class CustomerJS extends BaseJS {
    constructor() {
        super();
    }
    setDataUrl() {
        this.getDataUrl = "http://api.manhnv.net/api/customers"
    }
}

