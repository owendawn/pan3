// <!-- 优先使用 IE 最新版本和 Chrome -->
document.writeln(
  '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />'
);
// <!-- 页面描述 -->
document.writeln('<meta name="description" content="不超过150个字符" />');
// <!-- 页面关键词 -->
document.writeln('<meta name="keywords" content="" />');
// <!-- 网页作者 -->
document.writeln('<meta name="author" content="pan" />');
// <!-- 搜索引擎抓取 -->
document.writeln('<meta name="robots" content="index,follow" />');
// <!-- 为移动设备添加 viewport -->
document.writeln(
  '<meta name="viewport" content="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no">'
);
// <!-- `width=device-width` 会导致 iPhone 5 添加到主屏后以 WebApp 全屏模式打开页面时出现黑边 http://bigc.at/ios-webapp-viewport-meta.orz -->

// <!-- 添加到主屏后的标题（iOS 6 新增） -->
document.writeln('<meta name="apple-mobile-web-app-title" content="标题">');
// <!-- 是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏 -->
document.writeln('<meta name="apple-mobile-web-app-capable" content="yes" />');
// <!-- 添加智能 App 广告条 Smart App Banner（iOS 6+ Safari） -->
document.writeln(
  '<meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL">'
);
// <!-- 设置苹果工具栏颜色 -->
document.writeln(
  '<meta name="apple-mobile-web-app-status-bar-style" content="black" />'
);
// <!-- 忽略页面中的数字识别为电话，忽略email识别 -->
document.writeln(
  '<meta name="format-detection" content="telphone=no, email=no" />'
);
// <!-- 启用360浏览器的极速模式(webkit) -->
document.writeln('<meta name="renderer" content="webkit">');
// <!-- 避免IE使用兼容模式 -->
document.writeln('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
// <!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
document.writeln('<meta name="HandheldFriendly" content="true">');
// <!-- 微软的老式浏览器 -->
document.writeln('<meta name="MobileOptimized" content="320">');
// <!-- uc强制竖屏 -->
document.writeln('<meta name="screen-orientation" content="portrait">');
// <!-- QQ强制竖屏 -->
document.writeln('<meta name="x5-orientation" content="portrait">');
// <!-- UC强制全屏 -->

// <!-- QQ强制全屏 -->

// <!-- UC应用模式 -->

// <!-- QQ应用模式 -->

// <!-- windows phone 点击无高光 -->
document.writeln('<meta name="msapplication-tap-highlight" content="no">');

// <!-- Windows 8 磁贴颜色 -->
document.writeln('<meta name="msapplication-TileColor" content="#000" />');
// <!-- Windows 8 磁贴图标 -->
document.writeln('<meta name="msapplication-TileImage" content="icon.png" />');
// <!-- 添加 RSS 订阅 -->
document.writeln(
  '<link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />'
);
// <!-- 添加 favicon icon -->
document.writeln(
  '<link rel="shortcut icon" type="image/ico" href="http://pic.yupoo.com/owendawn/7d83eaa2/ac62287a.png" />'
);

//-------------------------------------------------------------- 以上垃圾，以下base ------------------------------------------------------------------------------
function loadCss(src, succ, fail) {
  var node = document.createElement("link");
  node.rel = "stylesheet";
  node.href = src;
  document.head.insertBefore(node, document.head.firstChild);

  if (node.attachEvent) {
    //IE
    node.attachEvent("onload", function () {
      succ && succ(node);
    });
  } else {
    //other browser
    setTimeout(function () {
      poll(node, succ, fail);
    });
  }
  function poll(node, scallback, fcallback) {
    var isLoaded = false;
    if (/webkit/i.test(navigator.userAgent)) {
      //webkit
      if (node["sheet"]) {
        isLoaded = true;
      }
    } else if (node["sheet"]) {
      // for Firefox
      try {
        if (node["sheet"].cssRules) {
          isLoaded = true;
        }
      } catch (ex) {
        // NS_ERROR_DOM_SECURITY_ERR
        if (ex.code === 1000) {
          isLoaded = true;
        }
      }
    }
    if (isLoaded) {
      setTimeout(function () {
        scallback && scallback(node);
      }, 1);
    } else {
      setTimeout(function () {
        fcallback && fcallback(node);
      }, 1000);
    }
  }

  node.onLoad = function () {
    succ && succ(node);
  };
}

function loadJs(src, succ, fail) {
  var node = document.createElement("script");
  node.type = 'text/javascript';

  var ok = false;
  node.onload = function () {

    succ && succ(node);
    ok = true;
  }
  node.src = src;
  document.head.append(node);
  setTimeout(function () {
    !ok && fail && fail()
  }, 2000);

}
//-----------------------------
document.writeln("<script src='./assert/util/PanUtil.js'></script>")
// <!--html5 旧浏览器支持-->
loadJs("https://cdn.bootcss.com/modernizr/2010.07.06dev/modernizr.min.js", null, function () {
  loadJs("https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js", null, null)
})


// while(!window.jQuery){}

// <!-- Load React. -->
// <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
document.writeln(
  '<script src="https://cdn.staticfile.org/react/16.4.0/umd/react.development.js"></script>'
);
document.writeln(
  '<script src="https://cdn.staticfile.org/react-dom/16.4.0/umd/react-dom.development.js"></script>'
);
document.writeln(
  '<script src="https://cdn.staticfile.org/babel-standalone/6.26.0/babel.min.js"></script>'
);


console.log("noBootstrapCss", window.noBootstrapCss);
if (!window.noBootstrapCss) {
  loadCss("https://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css", null, function (node) {
    loadCss("https://cdn.staticfile.org/twitter-bootstrap/3.3.0/css/bootstrap.min.css");
  });
}
loadCss("https://cdn.bootcss.com/normalize/2.1.3/normalize.min.css", null, function (node) {
  loadCss("https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css");
});

document.writeln(
  '<link href="//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">'
);


document.onload = function () {
  document.body.append('<iframe src="http://pan.is-best.net/pan3/backend/api.php?m=VideoController!getDateTime&callback=_" style="display:none;"></iframe>');
}

function repackageHref() {
  var as = document.getElementsByTagName('a')
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    element.onclick = function (e) {
      e.preventDefault();
      PanUtil.iframePostMessage("redirect",
        element.href,
        null, (re) => {

        });
    }
  }
}