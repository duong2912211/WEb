
class BaseJS {
    constructor() {
        this.host = "http://api.manhnv.net";
        this.apiRouter = null;
        this.getDataUrl = null;
        this.setApiRouter();
        this.loadData();
        this.initEvents();
    }

    setApiRouter() {

    }
    setDataUrl() {

    }
    /**
     * Hàm set sự kiện cho các nút 
     * CreateBy: DUONG(5/1/2021)
     * */
    initEvents() {
        var me = this;
        //Sự kiện click khiaans thêm mới 
        $('#btnAdd').click(function () {
            try {
                //Hiển thị thông tin chi tiết
                $('#dialog').css('display', 'block');
                //load dữ liệu cho các combobox:
                var select = $('select#cbxCustomerGroup');
                select.empty();
                // lấy dữ liệu nhóm khách hàng
                $('.loading').show();
                $.ajax({
                    url: me.host + "/api/customergroups",
                    method: "GET"
                }).done(function (res) {
                    if (res) {
                        console.log(res);
                        $.each(res, function (index, obj) {
                            var option = $(`<option value="${obj.CustomerGroupId}">${obj.CustomerGroupName}</option>`);
                            select.append(option);
                        })
                    }
                    $('.loading').hide();
                }).fail(function (res) {
                    $('.loading').hide();
                })
            } catch (e) {
                console.log(e);
            }
        })
        //Load lại dữ liệu khi nhấn button nạp
        $('#btnRefresh').click(function () {
            //Load lại dữ liệu
            me.loadData();
        })
        //Ẩn form chi tiết khi ấn hủy 
        $('#btnCancel').click(function () {
            //Ẩn thông tin chi tiết
            $('#dialog').css('display', 'none');
        })

        //Ẩn form chi tiết khi ấn close 
        $('#btnClose').click(function () {
            //Ẩn thông tin chi tiết
            $('#dialog').css('display', 'none');
        })

        //Lưu dữ liệu khi ấn button save
        $('#btnSave').click(function () {
            //validate dữ liệu
            var inputValidate = $('input[required], input [type="email"]');
            $.each(inputValidate, function (index, input) {
                $(input).trigger('blur');
            })
            var inputNotValids = $('input[validate="false"]');
            if (inputNotValids && inputNotValids.length > 0) {
                alert("Dữ liệu không hợp lệ vui lòng kiểm tra lại.");
                inputNotValids[0].focus();
                return;
            }

            //thu thập thông tin dữ liệu được nhập --> build thành object
            var inputs = $('input[fieldName],select[fieldName]');
            var entity = {};
            $.each(inputs, function (index, input) {
                var propertyName = $(this).attr('fieldName');
                var value = $(this).val();
                // Check với trường hợp input là radio , thì chỉ lấy value của input có attribute là checked
                if ($(this).attr('type') == "radio") {
                    if (this.checked) {
                        entity[propertyName] = value;
                    }
                } else {
                    entity[propertyName] = value;
                }
            })

            //Gọi service tương ứng thực hiện lưu dữ liệu
            //+Sau khi lưu thành công đưa ra thông báo cho người dùng
            //+ẩn form chi tiết
            //+load lại dữ liệu
            $.ajax({
                url: me.host + me.apiRouter,
                method: 'POST',
                data: JSON.stringify(entity),
                contentType: 'application/json'
            }).done(function (res) {
                debugger;
                alert('Thêm thành công!');
                me.loadData();
            }).fail(function (res) {
                console.log(res);
            }.bind(this))


        })
        //Hiển thị thông tin chi tiết khi ấn đúp chuột
        $('table tbody').on('dblclick', 'tr', function () {
            $('#dialog').css('display', 'block');
        })

        /**
         * Cảnh báo khi trường bắt buộc nhập trống
         * CreatedBy: DUONG(6/1/2021)
         * */
        $('input[required]').blur(function () {
            //Kiểm tra dữ liệu đã nhập nếu để trống thì cảnh báo 
            var value = $(this).val();
            if (!value) {
                $(this).addClass('border-red');
                $(this).attr('title', 'This field can not null');
                $(this).attr("validate", false);
            }
            else {
                $(this).removeClass('border-red');
                $(this).attr("validate", true);
            }
        })

        /**
         * Cảnh báo nhập email đúng kiểu cách
         * CreatedBy:DUONG(06/1/2021)
         */
        $('input[type="email"]').blur(function () {
            var value = $(this).val();
            var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
            if (!testEmail.test(value)) {
                // Do whatever if it fails.
                $(this).addClass('border-red');
                $(this).attr('title', 'Email không đúng định dạng');
                $(this).attr("validate", false);
            }
            else {
                // Do whatever if it passes.
                $(this).removeClass('border-red');
                $(this).attr("validate", true);
            }
        })
    }
    /**----------------------------------------------------------
     * Load dữ liệu
     * CreateBy:Duong (4/1/2021)
     * */
    loadData() {
        var me = this;
        $('table tbody').empty();
        var columns = $('table thead th');
        var getDataUrl = this.getDataUrl;
        $('.loading').show();
        $.ajax({
            url: me.host + me.apiRouter,
            method: "GET",
        }).done(function (res) {
            var data = res;
            $.each(data, function (index, obj) {
                var tr = $(`<tr></tr> `);
                //Lấy thông tin dữ liệu sẽ map tương ứng 
                $.each(columns, function (index, th) {
                    var td = $(`<td><div><span></span></div></td>`);
                    var fieldName = $(th).attr('fieldName');
                    var value = obj[fieldName];
                    var formatType = $(th).attr('formatType');
                    switch (formatType) {
                        case "ddmmyyyy":
                            td.addClass("text-align-center");
                            value = formatDate(value);
                            break;
                        case "Money":
                            td.find('div').addClass("text-align-center");
                            value = formatMoney(value);
                            break;
                        default:
                            break;
                    }
                    td.append(value);
                    $(tr).append(td);
                })
                $('table tbody ').append(tr);
                $('.loading').hide();
            })
        }).fail(function (res) {


        })
    }
}
//Lay du lieu ve
