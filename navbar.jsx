
class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isLogin:false
        }
    }
    componentDidMount(){
        let that=this;

        let nav=document.getElementById("navbar-content");
        let script=document.createElement("SCRIPT");
        script.src="//cdn.bootcss.com/segment-js/1.0.8/segment.min.js";

        let script2=document.createElement("SCRIPT");
        script2.src="assert/js/ease.js";

        let link=document.createElement("LINK");
        link.rel="stylesheet";
        link.href="assert/css/navbar.css";

        nav.appendChild(script2);
        nav.appendChild(script);
        nav.insertBefore(link,nav.childNodes[0]);

        script.onload=function(){
            that.init();
        }
       this.checkLogin();
    }
    logout(){
        window.localStorage.removeItem("token");
        window.location.href="login.html";
    }
    checkLogin(){
        let that=this;
        if(window.localStorage.getItem("token")){
            /* 创建 XMLHttpRequest 对象 */
            let xmlhttp;
            if (window.XMLHttpRequest){
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            }else{// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            
            if (xmlhttp==null){
                alert('您的浏览器不支持AJAX！');
                return false;
            }
            var url="backend/api.php?m=UserController!checkloginAlways";
            xmlhttp.open("POST",url,false);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("key="+window.localStorage.getItem("token"));
        
            var d=JSON.parse(xmlhttp.responseText); // 返回值
            that.setState({isLogin:d.login});
            that.props.checkLoginCallBack&&that.props.checkLoginCallBack(d.login);
        }else{
            that.props.checkLoginCallBack&&that.props.checkLoginCallBack(false);
        }
    }
    init(){
        (function() {
            /* In animations (to close icon) */
            var beginAC = 80,
                    endAC = 320,
                    beginB = 80,
                    endB = 320;
    
            function inAC(s) {
                s.draw('80% - 240', '80%', 0.3, {
                    delay: 0.1,
                    callback: function() {
                        inAC2(s)
                    }
                });
            }
    
            function inAC2(s) {
                s.draw('100% - 545', '100% - 305', 0.6, {
                    easing: ease.ease('elastic-out', 1, 0.3)
                });
            }
    
            function inB(s) {
                s.draw(beginB - 60, endB + 60, 0.1, {
                    callback: function() {
                        inB2(s)
                    }
                });
            }
    
            function inB2(s) {
                s.draw(beginB + 120, endB - 120, 0.3, {
                    easing: ease.ease('bounce-out', 1, 0.3)
                });
            }
    
            /* Out animations (to burger icon) */
            function outAC(s) {
                s.draw('90% - 240', '90%', 0.1, {
                    easing: ease.ease('elastic-in', 1, 0.3),
                    callback: function() {
                        outAC2(s)
                    }
                });
            }
    
            function outAC2(s) {
                s.draw('20% - 240', '20%', 0.3, {
                    callback: function() {
                        outAC3(s)
                    }
                });
            }
    
            function outAC3(s) {
                s.draw(beginAC, endAC, 0.7, {
                    easing: ease.ease('elastic-out', 1, 0.3)
                });
            }
    
            function outB(s) {
                s.draw(beginB, endB, 0.7, {
                    delay: 0.1,
                    easing: ease.ease('elastic-out', 2, 0.4)
                });
            }
    
            /* Awesome burger default */
            var pathA = document.getElementById('pathA'),
                    pathB = document.getElementById('pathB'),
                    pathC = document.getElementById('pathC'),
                    segmentA = new Segment(pathA, beginAC, endAC),
                    segmentB = new Segment(pathB, beginB, endB),
                    segmentC = new Segment(pathC, beginAC, endAC),
                    trigger = document.getElementById('menu-icon-trigger'),
                    toCloseIcon = true,
                    dummy = document.getElementById('dummy'),
                    wrapper = document.getElementById('menu-icon-wrapper');
    
            wrapper.style.visibility = 'visible';
    
            trigger.onclick = function() {
                if (toCloseIcon) {
                    inAC(segmentA);
                    inB(segmentB);
                    inAC(segmentC);
    
                    dummy.className = 'dummy dummy--active';
                } else {
                    outAC(segmentA);
                    outB(segmentB);
                    outAC(segmentC);
    
                    dummy.className = 'dummy';
                }
                toCloseIcon = !toCloseIcon;
            };
        })();
    }
    render(){
        return(
            <div className="content" id="navbar-content">
                <div className="device">
                    <div className="device__screen">
                        <div  style={{display: "inline-block",boxShadow: "inset 0 8em 0   rgba(0, 0, 0, 0.1)"}}>
                            <div id="menu-icon-wrapper" className="menu-icon-wrapper" style={{visibility: "hidden"}}>
                                <svg width="1000px" height="1000px">
                                    <path id="pathA" d="M 300 400 L 700 400 C 900 400 900 750 600 850 A 400 400 0 0 1 200 200 L 800 800"></path>
                                    <path id="pathB" d="M 300 500 L 700 500"></path>
                                    <path id="pathC" d="M 700 600 L 300 600 C 100 600 100 200 400 150 A 400 380 0 1 1 200 800 L 800 200"></path>
                                </svg>
                                <button id="menu-icon-trigger" className="menu-icon-trigger"></button>
                            </div>
                        </div>
                        <div id="dummy" className="dummy">
                            {!this.state.isLogin&&<div className="dummy__item"><a href="login.html">Login</a></div>}
                            {this.state.isLogin&&<div className="dummy__item"><a onClick={this.logout.bind(this)}>Logout</a></div>}
                            <div className="dummy__item"><a href="index.html">Home</a></div>
                            <div className="dummy__item"><a href="enjoy.html" >Enjoy Video</a></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
