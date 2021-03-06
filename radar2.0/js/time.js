// 获得并返回当前时间
function getToday() {
  const time = new Date();
  const year = time.getFullYear();
  // getMonth()+1是因为月份范围是[0,11]不是[1,12]
  const month = ("0" + (time.getMonth() + 1)).slice(-2);
  const day = ("0" + time.getDate()).slice(-2);
  const today = year + "-" + (month) + "-" + (day);
  return today;
}

// 设置时间控件初始值为当前时间，若limit为true，则限制不能选择已过日期
function initDate(obj, limit) {
  const today = getToday();
  obj.val(today);
  if (limit) {
    obj.attr("min", today);
  }
}

// 多次修改可选范围越来越小，不能这么写，只能在提交的时候检查
// 起止时间空间相互约束，止在起后，起在止前
function dateControl(objStart, objEnd) {
  objStart.change(function () {
    objEnd.attr("min", objStart.val());
  })
  objEnd.change(function () {
    objStart.attr("max", objEnd.val());
  })
}