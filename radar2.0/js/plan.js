// 初始化下拉框选项
function initSelect(serverUrl) {
  try {
    // 清空select列表数据
    $('#subtask,#sSubtask, #status,#sStatus, #staff,#sStaff').empty();
    // Ajax获取动态数据
    $.ajax({
      url: serverUrl + '/GetMonthDropList',
      type: 'post',
      data: { loginName: userName },
      success: function (result) {
        if (result) {
          const data = JSON.parse(result);  // 转换成json对象
          const subtask = data.subtask;
          const status = data.status;
          const staff = data.repairman;
          const staffNo = data.repairmanNo;
          // 添加第一个option值
          $('#subtask,#staff').prepend('<option value="0">--------请选择--------</option>');
          $('#sSubtask,#sStaff,#sStatus').prepend('<option value="0">全部</option>');
          for (let i = 0; i < subtask.length; i++) {
            $('#subtask,#sSubtask').append('<option value="' + subtask[i] + '">' + subtask[i] + '</option>');
          };
          $.each(status, function (i, val) {
            $('#status,#sStatus').append('<option value="' + val + '">' + val + '</option>');
          });
          for (let i = 0; i < staffNo.length; i++) {
            const person = new Object();
            person.name = staff[i];
            person.no = staffNo[i];
            mans.push(person);
            $('#staff,#sStaff').append('<option value="' + staff[i] + '">' + staff[i] + '</option>');
          };
          layui.form.render("select");

        }
        else {
          layer.alert('初始化下拉列表失败！');
          window.location.reload();
        }
      },
      error: function (msg) {
        layer.alert('网络连接错误' + JSON.stringify(msg));
      }
    });

  } catch (error) {
    window.location.reload();
    layer.alert(error.name + error.message);
  }
}

// 打开新建模态框
function addModal() {
  console.log('addPlan');
  // 表单重置
  $('#planForm')[0].reset();
  // 设置模态框标题
  $('#plan h4').text('新增任务计划');
  // 设置表单的action
  $('#planForm').prop('action', serverUrl + '/AddMonth');
  // 初始化日期输入框
  initDate($('#sDate,#eDate,#cTime'), 1);
  // 弹出模态框
  $('#plan').modal();
}

// 打开修改模态框，注意回填
function editModal(data) {
  console.log('editPlan');
  // 表单重置
  $('#planForm')[0].reset();
  // 设置模态框标题
  $('#plan h4').text('修改任务计划');
  // 设置表单的action
  $('#planForm').prop('action', serverUrl + '/UpdateMonth');
  // 回填表单
  $('#planID').val(data.monthlyScheduleId);
  $('#title').val(data.monthNo);
  $('#subtask').val(data.subtaskNo);
  $('#sDate').val(data.startTime);
  $('#eDate').val(data.endTime);
  $('#staff').val(data.repairman);
  $('#staffNo').val(data.repairmanNo);
  $('#status').val(data.status);
  $('#cTime').val(data.notesTime);
  $('#notes').val(data.notes);
  $('#detail').val(data.plan);
  // 弹出模态框
  $('#plan').modal();
}

// 提交新建/修改计划
function planSubmit() {
  const titles = $('#title').val();
  // const startTime = $('#sDate').val();
  // const endTime = $('#eDate').val();
  // const man = $('#staff').val();
  // console.log(man);
  //判断名称不能为空
  if (titles != "") {
    // 加载层
    const load = layer.load();
    const url = $('#planForm').attr('action');
    // const formData = $('#planForm').serialize();
    // console.log(formData);
    // const params = decodeURIComponent(formData, true);
    // console.log(params);
    $.ajax({
      url: url,
      type: 'post',
      data: {
        monthlyScheduleId: $('#planID').val(),
        monthNo: $('#title').val(),
        subtaskNo: $('#subtask').val(),
        startTime: $('#sDate').val(),
        endTime: $('#eDate').val(),
        repairman: $('#staff').val(),
        repairmanNo: $('#staffNo').val(),
        status: $('#status').val(),
        plan: $('#detail').val()
      },
      success: function (data) {
        console.log(data);
        if (data === 1) {
          //输出
          layer.alert('提交成功！', { icon: 1, title: '提示' });
          //刷新表格
          table.reload('pTable', { where: { loginName: userName }, page: { curr: 1 } });
        }
        else {
          layer.alert('提交失败！', { icon: 2, title: '提示' });
          // window.location.reload();
        }
      },
      error: function (msg) {
        layer.alert('网络连接错误' + JSON.stringify(msg));
      }
    });
    layer.close(load);
    // $.post(url, formData, function (returnMsg) {
    //     //关闭加载层
    //     layer.close(load);
    //     if (returnMsg) {
    //         //关闭模态框
    //         // $('#plan').modal("hide");
    //         //输出
    //         layer.alert('提交成功！', { icon: 1, title: '提示' });
    //         //刷新表格
    //         table.reload('pTable', { where: { loginName: userName }, page: { curr: 1 } });
    //     }
    //     else {
    //         layer.alert('提交失败...', { icon: 0, title: '提示' });
    //     }
    // });
  } else {
    layer.alert('请将数据填写完整！', { icon: 0, title: '提示' });
  };
}

// 删除
function planDelete(ID) {
  try {
    console.log(ID);
    $.ajax({
      url: serverUrl + '/DeleteMonth',
      type: 'post',
      data: { planID: ID },
      success: function (data) {
        if (data) {
          layer.alert('删除成功！', { icon: 1, title: '提示' });
          return 1;
        }
        else {
          layer.alert('删除失败...', { icon: 0, title: '提示' });
          return 0;
        }
      },
      error: function (msg) {
        layer.alert('网络连接错误' + JSON.stringify(msg));
        return 0;
      }
    });
  } catch (error) {
    window.location.reload();
    layer.alert(error.name + error.message);
  }
}
