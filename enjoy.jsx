class MainLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            list1: [],
            list2: []
        }
    }
    componentWillMount(){
        let that=this;
        let containers=document.getElementById("container");
        if (!PanUtil.isMobile()) {
            containers.insertBefore(this.createLinkElement("//cdn.bootcss.com/lightgallery/1.3.7/css/lightgallery.min.css"),containers.childNodes[0]);
           
            containers.appendChild(this.createScriptElement("https://cdn.bootcss.com/picturefill/3.0.2/picturefill.min.js"));
            let lightgallery=this.createScriptElement("http://cdn.bootcss.com/lightgallery/1.3.7/js/lightgallery.js");
            lightgallery.onload=function(){
                containers.appendChild(that.createScriptElement("http://cdn.bootcss.com/lightgallery/1.2.21/js/lg-pager.min.js"));
                containers.appendChild(that.createScriptElement("http://cdn.bootcss.com/lightgallery/1.2.21/js/lg-zoom.min.js"));
                containers.appendChild(that.createScriptElement("http://cdn.bootcss.com/lightgallery/1.2.21/js/lg-autoplay.min.js"));
                containers.appendChild(that.createScriptElement("http://cdn.bootcss.com/lightgallery/1.2.21/js/lg-thumbnail.min.js"));
                containers.appendChild(that.createScriptElement("http://cdn.bootcss.com/lightgallery/1.2.21/js/lg-fullscreen.min.js"));
            }
            containers.appendChild(lightgallery);
        }else{
            containers.appendChild(this.createScriptElement("http://cdn.bootcss.com/hammer.js/2.0.8/hammer.min.js"));
            containers.appendChild(this.createScriptElement("http://cdn.bootcss.com/screenfull.js/3.0.2/screenfull.min.js"));
            containers.appendChild(this.createScriptElement("assert/js/gallary.mobile.js"));
        }
    }
    componentDidMount() {
        this.mountDom();
        this.init();
    }

    init(){
        let that = this;
        $.post("backend/api.php?m=VideoController!getVideoByUser", { token: window.localStorage.getItem("token") }, function (data) {
            var counts = data.data.length, ready = 0;
            if (data.success) {
                that.setState({ list: data.data });
                that.setState({ list1: data.data.filter((it, idx) => idx % 2 === 0) });
                that.setState({ list2: data.data.filter((it, idx) => idx % 2 === 1) });
                $("img").one("load", function () {
                    ready++;
                    if (ready == counts) {
                        if (!PanUtil.isMobile()) {
                            that.animate();
                        } else {
                            $('#gallery-container').sGallery({
                                fullScreenEnabled: false
                            });
                        }
                        ready = 0;
                    }
                });


            }
        }, "json");
    }
    createScriptElement(src){
        let script = document.createElement("SCRIPT");
        script.src = src;
        return script;
    }
    createLinkElement(href){
        let link = document.createElement("LINK");
        link.rel = "stylesheet";
        link.href=href;
        return link;
    }
    mountDom() {
        let container = document.getElementById("container-content");
        container.appendChild(this.createScriptElement("assert/js/inputanimation.js"));
        container.appendChild(this.createScriptElement("assert/js/title.js"));


        if (!PanUtil.isMobile()) {
            container.insertBefore(this.createLinkElement("assert/css/enjoy.pc.css"), container.childNodes[0]);
        } else {
            container.insertBefore(this.createLinkElement("assert/css/gallary.mobile.css"), container.childNodes[0]);
        }
    }

    animate() {
        $("img.img-responsive").each(function () {
            $(this).delay(Math.random() * 1000).animate({ opacity: 0 }, {
                step: function (n) {
                    $(this).css("transform", "scale(" + (1 - n) + ")");
                },
                duration: 1000
            })
        }).promise().done(function () {
            storm();
        });
        function storm() {
            $("img.img-responsive").each(function () {
                $(this).delay(Math.random() * 1000).animate({ opacity: 1 }, {
                    step: function (n) {
                        $(this).css("transform", "rotateY(" + ((1 - n) * 360) + "deg) translateZ(" + ((1 - n) * 1000) + "px)");
                    },
                    duration: 3000,
                    easing: 'easeOutQuint'
                })
            }).promise().done(function () {
                $(".imgtitle").css("opacity", 1);
                $('#lightgallery').lightGallery({
                    selector: "#lightgallery>li .fa-search"
                });
            });
        }
    }

    jumpUrl(obj) {
        window.open(obj.attributes["data-link"].value);
    }
    checklogin(islogin){
        if(!islogin){
            window.location.href="login.html";
        }
        
    }
    render() {
        return (
            <div className="panel-body scroll" id="container-content">
                <Navbar checkLoginCallBack={this.checklogin.bind(this)}/>
                <div className="col-xs-12  nav-menu "
                    style={{ marginBottom: "13px", marginTop: "10px", fontSize: "14pt" }}>
                    <a href="enjoyedit.html"
                        className="pull-right"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title=""
                        data-original-title="应用管理">
                        <i className="glyphicon glyphicon-th-list"></i>
                    </a>
                </div>
                <div className="col-xs-12" style={{ padding: 0, marginBottom: "10px", boxShadow: "0 -4px 13px 0px rgba(0,0,0,.3)", marginLeft: "-15px", width: "calc(100% + 30px)" }}>
                    <canvas className="canvas col-sm-8 col-sm-offset-2 col-xs-12" id="nav-label" style={{ maxWidth: "800px" }}></canvas>
                </div>
                <div className="row" style={{ marginBottom: "30px" }}>
                    <div className="col-xs-12 col-sm-8 col-sm-offset-2">
                        <form className="form-group" action="http://v.baidu.com/v?word=s">
                            <label className="col-sm-2 control-label hidden">名字</label>
                            <div className="col-xs-8">
                                <input type="text"
                                    className="form-control"
                                    name="word"
                                    placeholder="please fill the name of video"
                                    style={{ background: "rgba(250, 244, 244, 0.7)", boxShadow: "3px 5px 9px #999" }} />
                            </div>
                            <div className="col-xs-4" style={{ paddingLeft: 0 }}>
                                <button className="a_demo_four">search</button>
                            </div>
                        </form>
                    </div>
                </div>


                {!PanUtil.isMobile() &&
                    <div className="row">
                        <div className="visible-md visible-lg col-md-2" id="leftarticle">
                            <p>“人生若只如初见，何事秋风悲画扇”如果人生的很多事，很多的境遇，很多的人，都还如初见时的模样该多好呀！若只是初见，一切美好都不会遗失。很多时候，初见，惊艳；蓦然回首，却已是物是人非,沧海桑田。。。</p>

                            <p> “执子之手，与子偕老”简简单单一句话，道尽了古今多少人的愿望。就像那首歌，“我能想到最浪漫的事，就是和你一起慢慢变老。。。”其实啊，人生在世，求什么呢，若有一个人，愿意与你生死相随，这一生，也就够了。</p>

                            <p>“曾经沧海难为水，除却巫山不是云”永远是这样，人的心啊，看过辽阔的大海，就看不上寻常的小溪小河了，去看过巫山的云，就不觉得其他地方的云是云了。所以其实不要太早遇见好男人/好女人，因为万一捉不住他/她，你会一辈子都活在这句诗句里。</p>

                            <p>“此情可待成追忆只是当时已惘然”现在回想，旧情难忘，犹可追忆，只是一切都恍如隔世了。一个“已”字，可怕至极。若非当初年少无知，何至如此!</p>

                            <p>“纵使相逢应不识，尘满面，鬓如霜”这是我最害怕的一句，若是不见也就罢了，若是相见，却互不认识，就这样在岁月里蹉跎地擦肩而过，那该是多么令人心碎的一幕。。。</p>
                        </div>
                        <div className="grid demo-gallery col-md-8">
                            <ul id='lightgallery' className='list-unstyled'>
                                {
                                    this.state.list.map((it, idx) => (
                                        <li key={idx}>
                                            <a>
                                                <img src={it.img} className="img-responsive" />
                                                <span
                                                    className="imgtitle"
                                                    style={{ position: "absolute", color: "cyan", opacity: 0, bottom: "1px", left: "5px" }}>
                                                    {it.title}</span>
                                                <div className="covers" style={{ position: "absolute", top: 0, width: "100%", height: "100%", textAlign: "center" }}>
                                                    <div style={{ display: "inline-block", height: "50%", width: 0 }}></div>
                                                    <div style={{ display: "inline-block", verticalAlign: "middle" }}>
                                                        <i className="fa fa-search" data-src={it.img} data-link="www.baidu.com">
                                                            <img src={it.img} style={{ display: "none" }} />
                                                        </i>
                                                        <i data-link={it.link} onClick={this.jumpUrl.bind(this)} className="fa fa-link"></i>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="visible-md visible-lg col-md-2" id="rightarticle">
                            <p>
                                The furthest distance in the world <br />
                                &nbsp;&nbsp;---Rabindranath Tagore</p>
                            <br />

                            <p>The furthest distance in the world Is not between life and
                                death But when I stand in front of you Yet you don’t know that I
                            love you</p>

                            <p>The furthest distance in the world Is not when i stand in
                                font of you Yet you can’t see my love But when undoubtedly knowing
                            the love from both Yet cannot Be togehter</p>

                            <p>The furthest distance in the world Is not being apart while
                                being in love But when plainly can not resist the yearning Yet
                            pretending You have never been in my heart</p>

                            <p>The furthest distance in the world Is not But using one’s
                                indifferent heart To dig an uncrossable river For the one who loves
                            you</p>

                        </div>
                    </div>
                }

                {PanUtil.isMobile() &&
                    <div id="gallery-container">
                        <div>
                            <ul className="items--small sitems1" style={{ verticalAlign: "top" }}>
                                {this.state.list1.map((it, idx) => (
                                    <li className="item" data-idx={idx * 2} key={idx}>
                                        <a href="#">
                                            <img src={it.img} alt="" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <ul className="items--small sitems2" style={{ verticalAlign: "top" }}>
                                {this.state.list2.map((it, idx) => (
                                    <li className="item" data-idx={idx * 2 + 1} key={idx}>
                                        <a href="#">
                                            <img src={it.img} alt="" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <ul className="items--big">
                            {this.state.list.map((it, idx) => (
                                <li className="item--big" data-idx={idx * 2 + 1} key={idx}>

                                    <figure>
                                        <img src={it.img} alt="" />
                                        <figcaption className="img-caption" style={{ color: "#3193d3" }}>
                                            {it.title}&emsp;
                                           <a href={it.link} style={{ color: "lightskyblue" }}>
                                                Link<i className="glyphicon glyphicon-link"></i>
                                            </a>
                                        </figcaption>
                                    </figure>

                                </li>
                            ))}
                        </ul>
                        <div className="controls">
                            <span className="control icon-arrow-left" data-direction="previous"></span>
                            <span className="control icon-arrow-right" data-direction="next"></span>
                            <span className="grid icon-grid"></span>
                            <span className="fs-toggle icon-fullscreen"></span>
                        </div>

                    </div>
                }
            </div>

        )
    }
}