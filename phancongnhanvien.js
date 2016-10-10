$(function() {
    // display working time on the basis of current date time
    displayTimeMsg("today_working_time_span");

    // get customer email from url if any
    if (window.location.search) {
        var qStr = window.location.search.substring(1);
        var    params = qStr.split(/\&|\?/);
        for (var i = 0; i < params.length; i++) {
            var val = params[i].split("=");
            if ("e" == val[0]) {
                //$("#khachhang_email_field").val(val[1]);
                if (window.sessionStorage) {
                    window.sessionStorage.setItem("khachhang_email", val[1]);
                }
                break;
            }
        }
    }

    // perform a synchronous HTTP request to get data from server first
    var dataUrl = $("#dataUrl").val();
    $.ajax({
        async: false,
        url: dataUrl,
        dataType: "json"
    }).done(function(data) {
        $("#cityStore").data("locations", data);
        renderCityRadios();
    }).fail(function(jqXHR, textStatus) {
        console.log("Error in loading data: " + textStatus);
    });

    // set default info for Ho Chi Minh city
    $("#vp_city_hcm").prop("checked", true);
    var currentCity = $("#vp_city_hcm").val();
    populateEmpList(currentCity);
    var defEmp = getCityData(currentCity);
    changeValues(defEmp);
    // load manager for default city
    loadManagerByCity(currentCity);

    // trigger onchange event of select field on changing city
    $("input[name='vp_city']").on("click", function(evt) {
        var city = $(this).val();
        populateEmpList(city);
        var emp = getCityData(city);
        if (emp) {
            changeValues(emp);
        }
        // load manager for each city
        loadManagerByCity(city);
    });

    $("#signup_nvkd_name").on("change", function(evt) {
        var city = $("input[name='vp_city']:checked").val();
        var empIdx = this.selectedIndex;
        var emp = getSelectedEmp(city, empIdx);
        if (emp) {
            changeValues(emp);
        }
    });
});

/**
 * Function to display the message on the basis of current system date time
 *
 * @param objId the control id in which to display message
 */
function displayTimeMsg(objId) {
    var msg_working_time = "Trong ít phút nữa sẽ có chuyên viên";
    var msg_break_time = "1h30 chiều nay sẽ có chuyên viên";
    var msg_out_of_working_time = "8h sáng mai sẽ có chuyên viên";
    var msg_day_off = "8h sáng thứ 2 sẽ có chuyên viên";
    var msg_current_status = "";
    var dt = new Date();
    var day = dt.getDay();
    var hours = dt.getHours();
    if (day > 0 && day < 6) {
        if ((hours >= 7 && hours < 12) || (hours >= 13 && hours < 18)) {
            msg_current_status = msg_working_time;
        } else if (hours < 7 || hours >= 18) {
            msg_current_status = msg_out_of_working_time;
        } else {
            msg_current_status = msg_break_time;
        }
    } else if ((day == 0) || (day == 6 && hours >= 12)) {
        msg_current_status = msg_day_off;
    } else {
        msg_current_status = msg_working_time;
    }
    $("#" + objId).val(msg_current_status);
}

function renderCityRadios() {
    var div = $("#cityEncDiv");
    var locations = $("#cityStore").data("locations");
    $.each(locations, function(index, loc) {
        $("<input>", {
            type: "radio",
            id: loc['id'],
            name: "vp_city",
            value: loc['value']
        }).appendTo(div);
        $("<label></label>", {
            "for": loc['id'],
            "text": loc['name']
        }).appendTo(div);
    });
}

function loadManagerByCity(city) {
    var locations = $("#cityStore").data("locations");
    $.each(locations, function(index, loc) {
        if (city == loc["value"]) {
            var manager = loc["manager"];
            if (manager) {
                $('#signup_tenquanly').val(manager['fullname']);
                $('#signup_dtquanly').val(manager['phone']);
                $('#signup_emailquanly').val(manager['email']);
            }
            return false;
        }
    });
    $('#signup_tp').val(city);
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive) Using
 * Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCityData(city) {
    var empData = {};
    var locations = $("#cityStore").data("locations");
    $.each(locations, function(index, loc) {
        if (city == loc["value"]) {
            if (city == "") {
                empData = loc["employee"];
            } else {
                var employees = loc["employees"];
                if (employees && employees.length) {
                    var empIdx = getRandomInt(0, employees.length - 1);
                    if (empIdx >= 0) {
                        empData = employees[empIdx];
                    }
                }
            }
            return false;
        }
    });
    return empData;
}

function getSelectedEmp(city, empIdx) {
    var emp = {};
    var locations = $("#cityStore").data("locations");
    $.each(locations, function(index, loc) {
        if (city == loc["value"]) {
            var employees = loc["employees"];
            if (employees && employees.length) {
                emp = employees[empIdx];
            }
            return false;
        }
     });
    return emp;
}

function changeValues(employee) {
    $('#signup_nvkd_name').val(employee["id"]);
    $('#signup_nvkd_email').val(employee["email"]);
    $('#signup_nvkd_phone').val(employee["phone"]);
    $('#googleFormDiv #google_form_frame').prop("src", employee["google_form_url"]);
}

function populateEmpList(city) {
    var empList = [];
    var locations = $("#cityStore").data("locations");
    $.each(locations, function(index, loc) {
        if (city == loc["value"]) {
            empList = loc["employees"];
            return false;
        }
    });
    // remove all old select items
    $("#signup_nvkd_name").empty();
    var select = $("#signup_nvkd_name")[0];
    $.each(empList, function(index, emp) {
        var empOpt = new Option(emp['name'], emp['id']);
        select.options.add(empOpt);
    });
}