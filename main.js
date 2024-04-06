var app = angular.module("myApp", ["ngRoute"]);
app.controller("myCtrl", function ($scope, $rootScope, $routeParams, $http) {
  $scope.products = [];
  $scope.start = 0;

  //Thêm giỏ hàng
  $rootScope.cart = [];
  //tổng số lượng
  $rootScope.toTalQuantity = function () {
    var ttQ = 0;
    for (i = 0; i < $scope.cart.length; i++) {
      ttQ += $scope.cart[i].quantity;
    }
    return ttQ;
  }
  //tổng giá
  $rootScope.toTalPrice = function () {
    var ttP = 0;
    for (i = 0; i < $scope.cart.length; i++) {
      ttP += $scope.cart[i].quantity * $scope.cart[i].price;
    }
    return ttP;
  }
  //xóa sp trong giỏ hàng
  $rootScope.delete = function (index) {
    $scope.cart.splice(index, 1);
  }

  //Thêm giỏ hàng
  $rootScope.addCart = function (p) {
    // Bắt lỗi đăng nhập
    if (!$rootScope.isLogin) {
      alert("Bạn cần Đăng nhập để đặt chuyến đi");
      window.location.href = "#!Login";
    } else {
      var index = $scope.cart.findIndex(x => x.id == p.id);
      if (index >= 0) {
        $scope.cart[index].quantity++;
      } else {
        var prodInCart = { id: p.id, name: p.name, image: p.image, price: p.sale, quantity: 1 }
        $scope.cart.push(prodInCart);
      }
      console.log($scope.cart);
    }
  }

  //Đọc dữ liệu từ file json
  $http.get("data.json").then(function (reponse) {
    $scope.products = reponse.data;

    //Chuyển trang sản phẩm
    $scope.pageCount = Math.ceil($scope.products.length / 6);
    //lùi
    $scope.prev = function () {
      if ($scope.start > 0) {
        $scope.start -= 6;
      }
    }
    //tới
    $scope.next = function () {
      if ($scope.start < ($scope.pageCount - 1) * 6) {
        $scope.start += 6;
      }
    }
    // 1
    $scope.one = function () {
      $scope.start = 0;
    }
    // 2
    $scope.two = function () {
      $scope.start = 6;
    }
    // 3
    $scope.three = function () {
      $scope.start = ($scope.pageCount - 1) * 6;
    }

    //Sắp xếp
    $scope.Sort = "price";

    //Khúc này là chuyển từ id để lấy sản phẩm 
    $scope.detailPro = $scope.products.find(item => item.id == $routeParams.id);
    $scope.detailPro.quantity = 1;
  });

  // Form đăng nhập
  $scope.list_acc = [];
  $scope.info = {};
  $scope.clear = function () {
    $scope.info = {};
  }

  // Đăng ký
  $scope.reg = function () {
    var isFind = false;
    for (i = 0; i < $scope.list_acc.length; i++) {
      if ($scope.info.username != null || $scope.info.password != null) {
        if ($scope.list_acc[i].username == $scope.info.username) {
          // Tai khoan da ton tai => update lai thong tin
          $scope.list_acc[i] = $scope.info;
          isFind = true;
          alert("Đăng ký không thành công. Tài khoản đã tồn tại");
          $scope.clear();
          return;
        }
      } else {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }
    }

    if (!isFind) {
      if ($scope.info.password != $scope.info.Valpassword) {
        return alert("Xác nhận mật khẩu chưa đúng");
      } else {
        // đẩy vào mảng
        if ($scope.list_acc.push(angular.copy($scope.info))) {
          // chuyển thành chuỗi để lưu vào localStorage
          localStorage.setItem("list_account", angular.toJson($scope.list_acc));
          alert("Đăng ký thành công");
          window.location.href = "#!Login";
          $scope.clear();
        }
      }
    }
  }

  // Check đăng nhập
  $rootScope.isLogin = false;

  if (sessionStorage.getItem('login')) {
    $rootScope.isLogin = true;
    $rootScope.info = angular.fromJson(sessionStorage.getItem('login'));
  }

  // Đăng nhập
  $scope.login = function () {
    // gọi function
    var check = checkLogin($scope.info.username, $scope.info.password);
    if (check != null) {
      sessionStorage.setItem('login', angular.toJson(check));
      $rootScope.isLogin = true;
      alert("Đăng nhập thành công");
      window.location.href = "#!home"
    } else {
      $rootScope.isLogin = false;
      alert("Sai Tên đăng nhập hoặc Mật khẩu");
      $scope.clear();
    }
  }

  // Đăng xuất
  $rootScope.logout = function () {
    sessionStorage.removeItem('login');
    $rootScope.isLogin = false;
    window.location.href = "#!home";
  }

  // Đổi mật khẩu
  $rootScope.ChangePass = function () {
    if ($rootScope.info.password != $rootScope.info.Valpassword) {
      return alert("Xác nhận mật khẩu chưa đúng");
    } else {
      for (i = 0; i < $scope.list_acc.length; i++) {
        // check mật khẩu cũ
        if ($scope.list_acc[i].password != $rootScope.info.oldPass) {
          return alert("Mật khẩu cũ chưa đúng");
        }
        // Đổi mật khẩu
        if ($scope.list_acc[i].username == $rootScope.info.username) {
          // Tai khoan da ton tai => update lai thong tin
          $scope.list_acc[i] = angular.copy($rootScope.info);
          localStorage.setItem("list_account", angular.toJson($scope.list_acc));
          alert("Đổi mật khẩu thành công");
          $rootScope.clear();
          return;
        }
      }
    }
  }

  // Cập nhật hồ sơ
  $rootScope.UpdateInfo = function () {
    for (i = 0; i < $scope.list_acc.length; i++) {
      if ($scope.list_acc[i].username == $rootScope.info.username) {
        // Tai khoan da ton tai => update lai thong tin
        $scope.list_acc[i] = angular.copy($rootScope.info);
        localStorage.setItem("list_account", angular.toJson($scope.list_acc));
        alert("Cập nhật hồ sơ thành công");
        $rootScope.clear();
        return;
      }
    }
  }

  // Xóa tài khoản
  // $rootScope.deleteAcc = function (index) {
  //   $scope.list_acc.splice(index, 1);
  //   localStorage.setItem("list_account", angular.toJson($scope.list_acc));
  // }

  function checkLogin(user, pass) {
    // duyệt mảng
    for (let i = 0; i < $scope.list_acc.length; i++) {
      if ($scope.list_acc[i].username == user && $scope.list_acc[i].password == pass) {
        return $scope.list_acc[i]; // trả về phần tử nếu điều kiện đúng
      }
    }
  }
  // chuyển ngược lại từ chuỗi thành đối tượng
  if (localStorage.getItem("list_account")) {
    $scope.list_acc = angular.fromJson(localStorage.getItem("list_account"));
  }
  console.log($scope.list_acc);

});
app.config(function ($routeProvider) {
  $routeProvider
    .when("/home", {
      templateUrl: "home.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/Destination", {
      templateUrl: "Destination.html?" + Math.random(),
    })
    .when("/Tour", {
      templateUrl: "Tour.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/Contact", {
      templateUrl: "Contact.html?" + Math.random(),
    })
    .when("/Cart", {
      templateUrl: "Cart.html?" + Math.random(),
    })
    .when("/detail/:id", {
      templateUrl: "detailProduct.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/Login", {
      templateUrl: "Login.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/SignUp", {
      templateUrl: "SignUp.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/Infomation", {
      templateUrl: "Infomation.html?" + Math.random(),
    })
    .when("/ChangePass", {
      templateUrl: "ChangePass.html?" + Math.random(),
    })
    .otherwise({
      templateUrl: "home.html",
      controller: "myCtrl",
    });
});