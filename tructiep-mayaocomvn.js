var locations = [{
            "id" : "HCM",
            "name" : "Ho Chi Minh",
            "employees" : [{
				"id" : "Nhung4",
                "name" : "Kinh Doanh - Mỹ Nhung4",
                "email" : "kd4@lamaothun.com",
                "phone" : "0931814505",
            }, {
				"id" : "Nga",
                "name" : "Kinh Doanh - Quỳnh Nga",
                "email" : "kd6@lamaothun.com",
                "phone" : "0901384700",
            }, {
				"id" : "Nhung1",
                "name" : "Kinh Doanh - Ánh Nhung",
                "email" : "kd1@lamaothun.com",
                "phone" : "0938965669",
            }, {
				"id" : "Linh",
                "name" : "Kinh Doanh - Thùy Linh",
                "email" : "kd3@lamaothun.com",
                "phone" : "0931417204",
            }]
			
			
			}, {
            "id" : "BD",
            "name" : "Binh Duong",
            "employees" : [{
                "id" : "Nam",
                "name" : "01 - Nam",
                "email" : "binhduong@aothundep.com",
                "phone" : "0948 636 881",
            }, {
                "id" : "Nam",
                "name" : "02 - Nam",
                "email" : "binhduong@aothundep.com",
                "phone" : "0948 636 881",
            }]
			
				}, {
            "id" : "BMT",
            "name" : "Buon Me Thuot",
            "employees" : [{
                "id" : "Tuấn",
                "name" : "01 - Tuấn",
                "email" : "buonmethuot@aothundep.com",
                "phone" : "0977 27 77 99",
            }, {
                "id" : "Tuấn",
                "name" : "02 - Tuấn",
                "email" : "buonmethuot@aothundep.com",
                "phone" : "0977 27 77 99",
            }]
			
        }, {
            "id" : "HN",
            "name" : "Ha Noi",
            "employees" : [{
                "id" : "Nghĩa",
                "name" : "01 - Nghĩa",
                "email" : "hanoi01@aothundep.com",
                "phone" : "0903 256 162",
            }, /**{
                "id" : "Mạnh",
                "name" : "02 - Mạnh",
                "email" : "hanoi02@aothundep.com",
                "phone" : "0902 250 399",
            },**/ {
                "id" : "Tựu",
                "name" : "03 - Tựu",
                "email" : "hanoi03@aothundep.com",
                "phone" : "093 444 3135",
            }]
        }];

        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         * Using Math.round() will give you a non-uniform distribution!
         */
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getCityData(city) {
            var empData = {};
            if (locations) {
                var length = locations.length;
                for (var i = 0; i < length; i++) {
                    var loc = locations[i];
                    if (city == loc["id"]) {
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
                        break;
                    }
                }
            }
            return empData;
        }

        function getSelectedEmp(city, empIdx) {
            var emp = {};
            if (locations) {
                var length = locations.length;
                for (var i = 0; i < length; i++) {
                    var loc = locations[i];
                    if (city == loc["id"]) {
                        var employees = loc["employees"];
                        if (employees && employees.length) {
                            emp = employees[empIdx];
                        }
                        break;
                    }
                }
            }
            return emp;
        }

        /**
         * Function to display the message on the basis of current system date time
         *
         * @param objId the control id in which to display message
         */
        function displayTimeMsg($, objId) {
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

        function changeValues($, employee) {
            $('#signup_nvkd_name').val(employee["id"]);
            $('#signup_nvkd_email').val(employee["email"]);
            $('#signup_nvkd_phone').val(employee["phone"]);
        }

        function populateEmpList($, city) {
            var empList = [];
            if (locations) {
                var length = locations.length;
                for (var i = 0; i < length; i++) {
                    var loc = locations[i];
                    if (city == loc["id"]) {
                        empList = loc["employees"];
                        break;
                    }
                }
            }
            // remove all old select items
            $("#signup_nvkd_name").empty();
            if (empList.length) {
                var select = $("#signup_nvkd_name")[0];
                for (var i = 0; i < empList.length; i++) {
                    var emp = new Option(empList[i]['name'], empList[i]['id']);
                    select.options.add(emp);
                }
            }
        }

        jQuery(function($) {
            // display working time on the basis of current date time
            displayTimeMsg($, "today_working_time_span");

            // get customer email from url if any
            if (window.location.search) {
                var qStr = window.location.search.substring(1),
                    params = qStr.split("&");
                for (var i = 0; i < params.length; i++) {
                    var val = params[i].split("=");
                    if ("e" == val[0]) {
                        $("#khachhang_email_field").val(val[1]);
                        break;
                    }
                }
            }

            // set default info for Ho Chi Minh city
            $("#vp_city_hcm").attr("checked", true);
            var currentCity = $("#vp_city_hcm").val();
            populateEmpList($, currentCity);
            var defEmp = getCityData(currentCity);
            changeValues($, defEmp);

            // trigger onchange event of select field on changing city
            $("input[name='vp_city']").on("click", function(evt) {
                var city = $(this).val();
                populateEmpList($, city);
                var emp = getCityData(city);
                if (emp) {
                    changeValues($, emp);
                }
            });

            $("#signup_nvkd_name").on("change", function(evt) {
                var city = $("input[name='vp_city']:checked").val();
                var empIdx = this.selectedIndex;
                var emp = getSelectedEmp(city, empIdx);
                if (emp) {
                    changeValues($, emp);
                }
            });
        });