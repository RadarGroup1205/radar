const serverUrl = 'http://10.222.6.46:8080/radar_db';
let user = sessionStorage.getItem('user');
user = JSON.parse(user);
const userName = user.name;

layui.use('table', function () {
  var table = layui.table;

  table.render({
    elem: '#pTable'
    , url: serverUrl + '/GetMonth'
    , where: { loginName: userName }
    , toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
    , defaultToolbar: ['filter', 'exports', 'print']
    , title: '用户数据表'
    , cols: [[
      { type: 'checkbox', fixed: 'left' }
      , { field: 'id', title: 'ID', width: 80, fixed: 'left', unresize: true, sort: true, templet: function (res) { return res.monthlyScheduleId } }
      , { field: 'title', title: '任务名', width: 100, edit: 'text', templet: function (res) { return res.monthNo } }
      , { field: 'subtask', title: '归属子任务', width: 120, sort: true, templet: function (res) { return res.subtaskNo } }
      , { field: 'sDate', title: '开始时间', width: 110, sort: true, templet: '<div>{{d.startTime}}</div>' }
      , { field: 'eDate', title: '结束时间', width: 110, sort: true, templet: '<div>{{d.endTime}}</div>' }
      , { field: 'staff', title: '执行人员', width: 120, templet: '<div>{{d.repairman}}</div>' }
      , { field: 'detail', title: '任务描述', templet: '<div>{{d.plan}}</div>' }
      , { field: 'status', title: '任务状态', width: 110, sort: true }
      , { field: 'cTime', title: '反馈时间', width: 110, sort: true, templet: '<div>{{d.notesTime}}</div>' }
      , { field: 'notes', title: '备注', width: 80 }
      , { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 150 }
    ]]
    , page: true
  });

  //头工具栏事件
  table.on('toolbar(pTable)', function (obj) {
    var checkStatus = table.checkStatus(obj.config.id);
    switch (obj.event) {
      case 'addPlan':
        addModal();
        break;
    };
  });

  //监听行工具事件
  table.on('tool(pTable)', function (obj) {
    const data = obj.data;
    //console.log(obj)
    if (obj.event === 'edit') {
      editModal(data);
    } else if (obj.event === 'del') {
      layer.confirm('真的删除行么', function (index) {
        const code = deletePlan(data.monthlyScheduleId);
        console.log(code);
        if (code) {
          obj.del();
        }
        layer.close(index);
      });
    }
  });

  var $ = layui.$, active = {
    reload: function () {
      let subtaskNo = $('#sSubtask').val();

      //执行重载
      table.reload('testReload', {
        page: {
          curr: 1 //重新从第 1 页开始
        }
        , where: {
          key: {
            subtask: subtaskNo
          }
        }
      }, 'data');
    }
  };

  $('.search-box .layui-btn').on('click', function () {
    var type = $(this).data('type');
    console.log($('#sSubtask').val());
    active[type] ? active[type].call(this) : '';
  });
});

// 监听按钮
$(document).ready(function () {
  // 提交
  $('#submit').click(function () {
    submitPlan();
  })
});

// initDate($('#ssDate,#seDate'), 0);

// 姓名与工号动态绑定
// 数组存放员工对象，属性有姓名和工号
let mans = [];
// 初始化下拉框选项
initDroplist();
// 职员变化，关联工号变化
const staff = document.querySelector('#staff');
staff.addEventListener('input', updateStaff);

// 下拉框初始化
function initDroplist() {
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

// 员工变化，动态更新其对应工号
function updateStaff() {
  let val = $(this).children('option:selected').val();
  if (val != 0) {
    const index = $(this).get(0).selectedIndex;
    const man = mans[index - 1];
    $('#staffNo').val(man.no);
  }
  else {
    $('#staffNo').val('');
  }
}

// 新建模态框打开
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

// 修改模态框打开，注意回填
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

// 新建/修改计划提交
function submitPlan() {
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

// 删除计划
function deletePlan(ID) {
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
