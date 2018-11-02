class MainLayout extends React.Component {
    constructor(props){
        super(props);
        this.state={
            table1:null,
            table2:null,
            imgs:[],
            imgidx:-1,
            isTrash:false,
            list:[]
        }
    }
    componentWillMount(){
        if(PanUtil.isMobile()){
            $(".bgcontainer").addClass("background");
        }else{
            $(".bgcontainer").addClass("backimage");
            
        }
    }
    componentDidMount(){
        let that=this;
        if(PanUtil.isMobile()){
            this.toggleModel(false);
        }else{
            let containers=document.getElementById("body-content");
            let datatable=this.createScriptElement("//cdn.bootcss.com/datatables/1.10.12/js/jquery.dataTables.min.js");
            datatable.onload=function(){
                let bdatatable=that.createScriptElement("//cdn.bootcss.com/datatables/1.10.12/js/dataTables.bootstrap.min.js");
                bdatatable.onload=function(){
                    $.extend(true, $.fn.dataTable.defaults, {
                        "oLanguage" : {
                            "sLoadingRecords": "<h1>载入中....</h1>",
                            "sProcessing" : "&nbsp;&nbsp;&nbsp;&nbsp;<li class='fa fa-spinner fa-spin'></li>正在加载中...",
                            "sLengthMenu" : "_MENU_ 记录/页",
                            "sZeroRecords" : "没有匹配的记录",
                            "sEmptyTable" : "没有符合条件的记录",
                            "sInfo" : "显示第 _START_ 至 _END_ 项记录，共 _TOTAL_ 项",
                            "sInfoEmpty" : "显示第 0 至 0 项记录，共 0 项",
                            "sInfoFiltered" : "(由 _MAX_ 项记录过滤)",
                            "sInfoPostFix" : "",
                            "sSearch" : "过滤:",
                            "sUrl" : "",
                            "oPaginate" : {
                                "sFirst" : "首页",
                                "sPrevious" : "上页",
                                "sNext" : "下页",
                                "sLast" : "末页"
                            }
                        }
                    });
                    that.initTable()
                    that.initTable2();
                }
                containers.appendChild(bdatatable);
            }
           containers.appendChild(datatable);
          
            
            
        }
    }
    createScriptElement(src){
        let script = document.createElement("SCRIPT");
        script.src = src;
        return script;
    }
     toggleModel(isTrash) {
         let that=this;
         let url;
         that.setState({isTrash:isTrash});
        if(isTrash){
            url="/pan3/backend/api.php?m=VideoController!getVideoOfTrash";
            $("#hometoggle").show();
            $("#trashtoggle").hide();
        }else{
            url= "/pan3/backend/api.php?m=VideoController!getVideoOfAvailable";
            $("#trashtoggle").show();
            $("#hometoggle").hide();
        }
        $.post(url, {token:window.localStorage.getItem("token")}, function (data) {
            data = data.aaData;
            that.setState({list:data});
        }, "json");
    
    }
    save(e){
        let that=this;
        let dom=e.target;
        var _fun=$(dom).attr("data-fun");
        var url;
        if(_fun=="add"){
            url="/pan3/backend/api.php?m=VideoController!addNewVideo";
        }else if(_fun=="edit"){
            url="/pan3/backend/api.php?m=VideoController!editVideoById"
        }
        $.post(url,$("#myModal form").serialize()+"&token="+window.localStorage.getItem("token"),function(data){
            if(data.code!="00000"){
                swal("提醒!", data.data.info, "warning");
            }else{
                !PanUtil.isMobile()&&that.state.table1.fnDraw();
                PanUtil.isMobile()&&that.toggleModel(false);
                $('#myModal').modal("hide");
            }
        },"json");
    }
    imgSearch(){
       let that=this;
        var _words=$("#myModal input[name='title']").val();
        if(_words.trim()==""){
            swal("提醒!", "请先填写视频名称", "warning");
        }else {
            swal({
                    title: "Are you sure?",
                    text: "确认搜索视频【" + _words + "】吗?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#5bc0de",
                    confirmButtonText: "yes",
                    cancelButtonText: "cancel",
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        $.post( "/pan3/backend/api.php?m=VideoController!getImgUrlByName", {
                            words: _words
                        }, function (datas) {
                            if (datas.code != "00000") {
                                swal("提醒!", datas.info, "warning");
                            }else if(datas.data.length==0){
                                swal("提醒!", "搜索结果为空，请手动输入", "warning");
                            } else {
                               that.setState({imgs :datas.data})
                               that.setState({imgidx :0})
                                $("#imgdiv .imgbtn").show();
                                that.showImage(0);
                            }
                        }, "json");
                    }
                });
        }
    }
    showModal(){
        this.clearModel(false);
        $('#myModal').modal({keyboard: true});
    }
     clearModel(isEditNotAdd){
        var _title,_fun;
        if(isEditNotAdd){
            _title="修改";
            _fun="edit";
        }else{
            _title="新增";
            _fun="add";
        }
        $("#myModal form").get(0).reset();
        $("#time option").removeAttr("selected");
        $("#myModalLabel").text(_title);
        $("#modalimg").attr("src","");
        $("#modelsave").attr("data-fun",_fun);
        $("#imgdiv .imgbtn").hide();
    }
     showImage(offset){
        let _src;
        if(offset!=undefined) {
            let imgidx=this.state.imgidx+offset;
            this.setState({imgidx:imgidx});
            _src=this.state.imgs[imgidx];
            if (imgidx == 0) {
                $("#imgdiv a:eq(0)").hide();
            } else {
                $("#imgdiv a:eq(0)").show();
            }
            if (imgidx == this.state.imgs.length - 1) {
                $("#imgdiv a:eq(1)").hide();
            } else {
                $("#imgdiv a:eq(1)").show();
            }
            _src = _src.replace(new RegExp("&amp;", "g"), "&");
        }else{
            _src=$("#myModal [name='image']").val().trim();
        }
        $("#modalimg").attr("src",_src);
    
    }
    
     chooseImg(){
        $("#image").val(this.state.imgs[this.state.imgidx].replace(new RegExp("&amp;", "g"), "&"));
    }
    fackDelete(id){
        let that=this;
        swal({
            title: "Are you sure?",
            text: "Are You Sure To Delete This Row?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "delete",
            cancelButtonText: "cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function(isConfirm){
            if (isConfirm) {
                $.post("/pan3/backend/api.php?m=VideoController!fackDeleteById", {
                    "id": id,
                    token:window.localStorage.getItem("token")
                }, function(datas) {
                    if(datas.code!="00000"){
                        swal("提醒!", datas.info, "warning");
                    }else{
                        !PanUtil.isMobile()&&that.state.table1.fnDraw();
                        !PanUtil.isMobile()&&that.state.table2.fnDraw();
                        PanUtil.isMobile()&&that.toggleModel(false);
                        swal("成功!", "delete the row success!", "success");
                        $('#myModal').modal("hide");
                    }
                }, "json");
            }
        });
    }
    editFromCard(id,e){
        this.clearModel(true);
        var _nRow = $(e.target).parents().parent("ul")[0];
        var _cells = $(_nRow).find("li>span");
        console.log(_cells);
        var $_modalDom = $("#myModal");
        $_modalDom.find("input[name='title']").val($(_nRow).parent().find(".panel-heading").text());
        $_modalDom.find("select[name='time']").html(this.parseWeek($(_cells[0]).attr("data-value")));
        $_modalDom.find("input[name='link']").val($(_cells[1]).text());
        $_modalDom.find("input[name='image']").val($(_cells[2]).text());
        $_modalDom.find("input[name='id']").val(id);
        $('#myModal').modal({keyboard: true});
    }
    initTable(){
        let oTable = $('#editabledatatable').dataTable({
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": false,
            "bSort": true,
            "bInfo": true,
            "bAutoWidth": true,
            "bRetrieve": true,
            "bStateSave": false,
            "iDisplayLength": 20,
            "bServerSide": true, //每次数据修改，都请求服务器确认
            "bScrollCollapse": true,
            "sPaginationType": "full_numbers",
            "sServerMethod": "POST",
            "sAjaxSource": "/pan3/backend/api.php?m=VideoController!getVideoOfAvailable",
            "aoColumns": [{
                "mData": "week",
                "sTitle": "时间",
                "sortable": true
            }, {
                "mData": "title",
                "sTitle": "名称",
                "sortable": false
            }, {
                "mData": "link",
                "sTitle": "网址",
                "sortable": false
            }, {
                "mData": "img",
                "sTitle": "图址",
                "sortable": false
            }, {
                "mData": "id",
                "sTitle": "操作",
                "sortable": false
            }],
            "fnServerParams": function(aoData) {
                aoData.push({ "name": "token","value": window.localStorage.getItem("token")});
            },
            "aoColumnDefs": [{
                "aTargets": [0],
                "sTitle": "时间",
                "mData": "week",
                "sortable": true,
                "mRender": function(data, type, full) {
                    if(!data){
                        data=0;
                    }
                    return "<span data-value='"+data+"'>"+['请选择','周一','周二','周三','周四','周五','周六','周日'][Number(data)]+"</span>";
                }
            },{
                "aTargets": [2],
                "mRender": function(data, type, full) {
                    if(!data){
                        return "<div></div>"
                    }
                    return "<div style='max-width: 270px;overflow: hidden;text-overflow: ellipsis;'>"+data+"</div>";
                }
            },{
                "aTargets": [3],
                "mRender": function(data, type, full) {
                    if(!data){
                        return "<div></div>"
                    }
                    return "<div style='max-width:270px;overflow: hidden;text-overflow: ellipsis;'>"+data+"</div>";
                }
            },{
                "aTargets": [4],
                "sTitle": "操作",
                "mData": "id",
                "sortable": false,
                "mRender": function(data, type, full) {
                    return '' +
                        '<a href="#" class="btn btn-info btn-xs edit" data-id="'+data+'" >' +
                        '   <i class="fa fa-edit"></i> Edit' +
                        '</a>' +
                        '<a href="#" class="btn btn-danger btn-xs delete" data-mydata-id=' + data + '>' +
                        '   <i class="fa fa-trash-o"></i> Delete' +
                        '</a>';
                }
            }]
        });
        let that=this;
        this.setState({table1:oTable});
        $('#editabledatatable').on("click", 'a.edit', function(e) {
            e.preventDefault();
            that.clearModel(true);
            var _nRow = $(this).parents('tr')[0];
            var _cells=$(_nRow).find("td");
            var $_modalDom=$("#myModal");
           
            $_modalDom.find("select[name='time']").html(that.parseWeek($(_cells[0]).find("span").attr("data-value")));
            $_modalDom.find("input[name='title']").val($(_cells[1]).text());
            $_modalDom.find("input[name='link']").val($(_cells[2]).text());
            $_modalDom.find("input[name='image']").val($(_cells[3]).text());
            $_modalDom.find("input[name='id']").val($(_cells[4]).find(".edit").attr("data-id"));
            $('#myModal').modal({keyboard: true});
        
        });
        $('#editabledatatable').on("click", 'a.delete', function(e) {
            var _id=$(this).attr("data-mydata-id");
            e.preventDefault();
            that.fackDelete(_id);
        });
    }
     parseWeek(data){
        var dd=['请选择','周一','周二','周三','周四','周五','周六','周日'];
        var returns="";
        for (var i = 0; i < dd.length; i++) {
            returns+="<option value='"+i+"' "+(Number(data)==i?"selected":"")+">"+dd[i]+"</option>";
        }
        returns+="";
        return returns;
    }
    realDelete(id){
        let that=this;
        swal({
            title: "Are you sure?",
            text: "Are You Sure To Delete This Row really?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "delete",
            cancelButtonText: "cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function(isConfirm){
            if (isConfirm) {
                $.post("/pan3/backend/api.php?m=VideoController!deleteById", {
                    "id": id,
                    token:window.localStorage.getItem("token")
                }, function(datas) {
                    if(datas.code!="00000"){
                        swal("提醒!", datas.info, "warning");
                    }else{
                        !PanUtil.isMobile()&&that.state.table2.fnDraw();
                        PanUtil.isMobile()&&that.toggleModel(true);
                        swal("成功!", "delete the row success!", "success");
                        $('#myModal').modal("hide");
                    }
                }, "json");
            }
        });
    }
    realReduct(id){
        let that=this;
        swal({
            title: "Are you sure?",
            text: "Are You Sure To reducte This Row?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#5bc0de",
            confirmButtonText: "reducted",
            cancelButtonText: "cancel",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function(isConfirm){
            if (isConfirm) {
                $.post("/pan3/backend/api.php?m=VideoController!reductedById", {
                    id: id,
                    token:window.localStorage.getItem("token")
                }, function(datas) {
                    if(datas.code!="00000"){
                        swal("提醒!", datas.info, "warning");
                    }else{
                        !PanUtil.isMobile()&&that.state.table1.fnDraw();
                        !PanUtil.isMobile()&&that.state.table2.fnDraw();
                        PanUtil.isMobile()&&that.toggleModel(true);
                        swal("成功!", "delete the row success!", "success");
                        $('#myModal').modal("hide");
                    }
                }, "json");
            }
        });
    }
    initTable2(){
       let oTable2 = $('#trashdatatable').dataTable({
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": false,
            "bSort": true,
            "bInfo": true,
            "bAutoWidth": true,
            "bRetrieve": true,
            "bStateSave": false,
            "iDisplayLength": 20,
            "bServerSide": true, //每次数据修改，都请求服务器确认
            "bScrollCollapse": true,
            "sPaginationType": "full_numbers",
            "sServerMethod": "POST",
            "sAjaxSource": "/pan3/backend/api.php?m=VideoController!getVideoOfTrash",
            "aoColumns": [{
                "mData": "week",
                "sTitle": "时间",
                "sortable": true
            }, {
                "mData": "title",
                "sTitle": "名称",
                "sortable": false
            }, {
                "mData": "link",
                "sTitle": "网址",
                "sortable": false
            }, {
                "mData": "img",
                "sTitle": "图址",
                "sortable": false
            }, {
                "mData": "id",
                "sTitle": "操作",
                "sortable": false
            }],
            "fnServerParams": function(aoData) {
                aoData.push({ "name": "token","value": window.localStorage.getItem("token")});
                aoData.push({name:'mDataProp_5',value:'updated_at'});
                for(var i=0;i<aoData.length;i++){
                    var it=aoData[i];
                    if(it.name=='iSortCol_0'){
                        aoData[i].value=5;
                    }
                }
            },
            "aoColumnDefs": [{
                "aTargets": [0],
                "sTitle": "时间",
                "mData": "week",
                "sortable": true,
                "mRender": function(data, type, full) {
                    if(!data){
                        data=0;
                    }
                    return "<span data-value='"+data+"'>"+['请选择','周一','周二','周三','周四','周五','周六','周日'][Number(data)]+"</span>";
                }
            },{
                "aTargets": [2],
                "mRender": function(data, type, full) {
                    if(!data){
                        return "<div></div>"
                    }
                    return "<div style='max-width: 270px;overflow: hidden;text-overflow: ellipsis;'>"+data+"</div>";
                }
            },{
                "aTargets": [3],
                "mRender": function(data, type, full) {
                    if(!data){
                        return "<div></div>"
                    }
                    return "<div style='max-width:270px;overflow: hidden;text-overflow: ellipsis;'>"+data+"</div>";
                }
            },{
                "aTargets": [4],
                "sTitle": "操作",
                "mData": "id",
                "sortable": false,
                "mRender": function(data, type, full) {
                    return '' +
                        '<a href="#" class="btn btn-info btn-xs reducte" data-mydata-id=' + data + '>' +
                        '   <i class="fa fa-edit"></i> Reducte' +
                        '</a>' +
                        '<a href="#" class="btn btn-danger btn-xs delete" data-mydata-id=' + data + '>' +
                        '   <i class="fa fa-trash-o"></i> Delete' +
                        '</a>';
                }
            }]
        });
        let that=this;
        this.setState({table2:oTable2});
        $('#trashdatatable').on("click", 'a.reducte', function(e) {
            var _id=$(this).attr("data-mydata-id");
            e.preventDefault();
           that.realReduct(_id);
        });
        $('#trashdatatable').on("click", 'a.delete', function(e) {
            var _id=$(this).attr("data-mydata-id");
            e.preventDefault();
            that.realDelete(_id);
        });
    }
    checklogin(islogin){
        if(!islogin){
            window.location.href="login.html";
        }
    }
    render() {
        return (
            <div className="panel-body" id="body-content">
                <Navbar checkLoginCallBack={this.checklogin.bind(this)}/>
                {!PanUtil.isMobile()&&
                <div style={{marginTop: "20%", paddingTop: 0}}>
                    <div className="tabbable tabs-left col-md-10 col-md-offset-1">
                        <ul className="nav nav-tabs" id="myTab3">
                            <li className="tab-sky active">
                                <a data-toggle="tab" href="#home">
                                    <i className="glyphicon glyphicon-home"></i>
                                </a>
                            </li>
                            <li className="tab-red">
                                <a data-toggle="tab" href="#profile">
                                    <i className="glyphicon glyphicon-trash"></i>
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="home" className="tab-pane active col-xs-12">
                                <div className="row localpath">
                                    <div className="link-buttons col-xs-1 pull-right" 
                                    style={{fontSize: "16pt"}}>
                                        <a href="enjoy.html" data-toggle="tooltip"
                                            data-placement="bottom" title="Enjoy Station">
                                            <i className="glyphicon glyphicon-th"></i>
                                        </a>
                                    </div>
                                </div>
                                <br />
                                <div className="col-xs-12">
                                    <button id="addnew" className="btn-info btn" onClick={this.showModal.bind(this)}>新增行</button>
                                </div>
                                <div className="col-xs-12">
                                    <table id="editabledatatable"
                                        className="table table-bordered table-striped table-condensed flip-content"></table>
                                </div>
                            </div>

                            <div id="profile" className="tab-pane col-xs-12">
                                <div className="row localpath">
                                    <div className="link-buttons col-xs-1 pull-right" 
                                    style={{fontSize: "16pt"}}>
                                        <a href="/pan/public/enjoy/enjoy" data-toggle="tooltip"
                                            data-placement="bottom" title="Enjoy Station">
                                            <i className="glyphicon glyphicon-th"></i>
                                        </a>
                                    </div>
                                </div>
                                <br />
                                <div className="col-xs-12">
                                    <table id="trashdatatable"
                                        className="table table-bordered table-striped table-condensed flip-content"
                                        style={{width: "100%"}}></table>
                                </div>
                            </div>
                            <div className="horizontal-space"></div>
                        </div>
                    </div>
                </div>
                }
                {PanUtil.isMobile()&&
                <div>
                    <div className="col-xs-12  nav-menu " 
                    style={{marginBottom: "10px",fontSize: "14pt",marginTop: "15px"}}>
                        <a href="enjoy.html" className="pointer pull-right" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="应用管理">
                            <i className="glyphicon glyphicon-th">应用中心</i>
                        </a>
                        <a onClick={this.toggleModel.bind(this,true)} className="pull-right pointer" 
                        style={{marginRight: "7px"}} 
                        id="trashtoggle" data-toggle="tooltip" data-placement="bottom" title="" 
                        data-original-title="应用管理">
                            <i className="glyphicon glyphicon-trash">回收站</i>
                        </a>
                        <a  onClick={this.toggleModel.bind(this,false)} className="pull-right pointer" 
                        style={{display: "none",marginRight: "7px"}}
                        id="hometoggle" data-toggle="tooltip" data-placement="bottom" title="" 
                        data-original-title="应用管理">
                            <i className="glyphicon glyphicon-home">应用管理</i>
                        </a>
                    </div>
                    <div className="col-xs-12"  
                    style={{marginBottom:"10px", boxShadow: "0 -4px 13px 0px rgba(0,0,0,.3)",padding:"5px"}} >
                        <a className="btn btn-info pull-right" id="addnew" onClick={this.showModal.bind(this)}>
                        <i className="glyphicon glyphicon-plus-sign">Add</i></a>
                    </div>
                    <div className="col-xs-12"id="cards-container"> 
                    {
                        this.state.list.map((it,idx)=>(
                            <div 
                            className="panel panel-default" 
                            style={{marginTop: "10px",background: "inherit",boxShadow: "0px 0px 3px 4px rgba(127, 127, 127, 0.3)"}}
                            key={idx}>
                               <div className="panel-heading" style={{opacity: 0.9,textAlign: "center"}}>{it.title}</div>
                               <ul className="list-group">
                                   <li className="list-group-item">时&emsp;&emsp;间：<span data-value={it.week}>{['请选择','周一','周二','周三','周四','周五','周六','周日'][it.week]}</span></li>
                                   <li className="list-group-item">链接地址：<span>{it.link}</span></li>
                                   <li className="list-group-item">图片地址：<span>{it.img}</span></li>
                                   <li className="list-group-item" style={{textAlign: "center"}}>
                                        {this.state.isTrash&&
                                            <a className="reducte"  data-id={it.id}  onClick={this.realReduct.bind(this,it.id)}>
                                                <i className="glyphicon glyphicon-share-alt">还原</i>
                                            </a>
                                        }
                                        &emsp;
                                         {this.state.isTrash&&
                                             <a className="delete" data-mydata-id={it.id} onClick={this.realDelete.bind(this,it.id)}>
                                                <i className="glyphicon glyphicon-trash">删除</i>
                                            </a>
                                        }
                                        {!this.state.isTrash&&
                                            <a className="edit"  data-id={it.id} onClick={this.editFromCard.bind(this,it.id)}>
                                                <i className="glyphicon glyphicon-edit">修改</i>
                                            </a>
                                        }
                                      &emsp;
                                        {!this.state.isTrash&&
                                             <a className="delete" data-mydata-id={it.id} onClick={this.fackDelete.bind(this,it.id)}>
                                                <i className="glyphicon glyphicon-trash">删除</i>
                                            </a>
                                        }
                                            
                                        
                                       
                                   </li>
                               </ul>
                            </div>
                        ))
                    }
                    </div>
                </div>
                }
                <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                <h4 className="modal-title" id="myModalLabel"></h4>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal" role="form">
                                    <input type="hidden" name="id"/>
            
                                    <div className="form-group">
                                        <label  className="col-sm-2 control-label">视频名称</label>
            
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" 
                                            id="title" name="title" placeholder="请输入视频名称"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">时间</label>
            
                                        <div className="col-sm-10">
                                            
                                            <select className="form-control" id="time" name="time">
                                                <option value="0">请选择时间</option>
                                                <option value="1">周一</option>
                                                <option value="2">周二</option>
                                                <option value="3">周三</option>
                                                <option value="4">周四</option>
                                                <option value="5">周五</option>
                                                <option value="6">周六</option>
                                                <option value="7">周日</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">视频网址</label>
            
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" id="link" name="link" 
                                            placeholder="请输入视频导航网址"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">图片网址</label>
            
                                        <div className="col-sm-10">
                                            <div className="input-group">
                                                <input type="text" className="form-control"
                                                 id="image" name="image"/>
                                                <span className="input-group-btn">
            
                                                    <button type="button"
                                                            className="btn btn-default dropdown-toggle"
                                                            onClick={this.imgSearch.bind(this)}>
                                                        select&nbsp;
                                                    </button>
                                                    <button type="button" className="btn btn-default" 
                                                    onClick={this.showImage.bind(this,undefined)}>preview
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div id="imgdiv" style={{textAlign: "center"}}>
                                        <img src="" id="modalimg" style={{maxWidth:'100%'}}/>
                                        <a className="imgbtn" onClick={this.showImage.bind(this,-1)}>上一张</a>
                                        <a className="imgbtn" onClick={this.showImage.bind(this,1)} className="">下一张</a>
                                        <a className="imgbtn" onClick={this.chooseImg.bind(this)}>选择</a>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default"
                                        data-dismiss="modal">关闭
                                </button>
                                <button type="button" className="btn btn-primary" data-fun="none" 
                                id="modelsave"
                                onClick={this.save.bind(this)}>
                                    保存
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}