!(function (NioApp, $) {
    "use strict";

    // Variable
    var $win = $(window), $body = $('body'), breaks = NioApp.Break;

    NioApp.Kanban = function(){

        function titletemplate(title,count,optionicon="more-h"){
            return (`
                <div class="kanban-title-content">
                    <h6 class="title">${title}</h6>
                    <span class="badge badge-pill badge-outline-light text-dark">${count}</span>
                </div>
                <div class="kanban-title-content">
                    <div class="drodown">
                        <a href="#" class="dropdown-toggle btn btn-sm btn-icon btn-trigger mr-n1" data-toggle="dropdown"><em class="icon ni ni-${optionicon}"></em></a>
                        <div class="dropdown-menu dropdown-menu-right">
                            <ul class="link-list-opt no-bdr">
                                <li><a href="#"><em class="icon ni ni-edit"></em><span>Edit Board</span></a></li>
                                <li><a href="#"><em class="icon ni ni-plus-sm"></em><span>Add Task</span></a></li>
                                <li><a href="#"><em class="icon ni ni-plus-sm"></em><span>Add Option</span></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            `)
        }

    	var kanban = new jKanban({
            element: '#kanban',
            gutter:'0',
            widthBoard:'320px',
            responsivePercentage: false, 
            boards: [
                {
                    'id': '_open',
                    'title': titletemplate("Open","3"),
                    'class': 'kanban-light',
                    'item': [{
                        'title':`
                            <div class="kanban-item-title">
                                <h6 class="title">Dashlite Design Kit Update</h6>
                                <div class="drodown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        <div class="user-avatar-group">
                                            <div class="user-avatar xs bg-primary"><span>A</span></div>
                                        </div>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <ul class="link-list-opt no-bdr p-3 g-2">
                                            <li>
                                                <div class="user-card">
                                                    <div class="user-avatar sm bg-primary">
                                                        <span>AB</span>
                                                    </div>
                                                    <div class="user-name">
                                                        <span class="tb-lead">Abu Bin Ishtiyak</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="kanban-item-text">
                                <p>Update the new UI design for @dashlite template with based on feedback.</p>
                            </div>
                            <ul class="kanban-item-tags">
                                <li><span class="badge badge-info">Dashlite</span></li>
                                <li><span class="badge badge-warning">UI Design</span></li>
                            </ul>
                            <div class="kanban-item-meta">
                                <ul class="kanban-item-meta-list">
                                    <li class="text-danger"><em class="icon ni ni-calendar"></em><span>2d Due</span></li>
                                    <li><em class="icon ni ni-notes"></em><span>Design</span></li>
                                </ul>
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-clip"></em><span>1</span></li>
                                    <li><em class="icon ni ni-comments"></em><span>4</span></li>
                                </ul>
                            </div>
                        `,
                    },{
                        'title':`
                            <div class="kanban-item-title">
                                <h6 class="title">Implement Design into Template</h6>
                                <div class="drodown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        <div class="user-avatar-group">
                                            <div class="user-avatar xs bg-dark"><span>S</span></div>
                                        </div>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <ul class="link-list-opt no-bdr p-3 g-2">
                                            <li>
                                                <div class="user-card">
                                                    <div class="user-avatar sm bg-dark">
                                                        <span>SD</span>
                                                    </div>
                                                    <div class="user-name">
                                                        <span class="tb-lead">Sara Dervishi</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="kanban-item-text">
                                <p>Start implementing new design in Coding @dashlite.</p>
                            </div>
                            <ul class="kanban-item-tags">
                                <li><span class="badge badge-info">Dashlite</span></li>
                                <li><span class="badge badge-danger">HTML</span></li>
                            </ul>
                            <div class="kanban-item-meta">
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-calendar"></em><span>15 Dec 2020</span></li>
                                    <li><em class="icon ni ni-notes"></em><span>Forntend</span></li>
                                </ul>
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-comments"></em><span>2</span></li>
                                </ul>
                            </div>
                        `,
                    },{
                        'title':`
                            <div class="kanban-item-title">
                                <h6 class="title">Dashlite React Version</h6>
                                <div class="drodown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        <div class="user-avatar-group">
                                            <div class="user-avatar xs bg-blue"><span>C</span></div>
                                        </div>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <ul class="link-list-opt no-bdr p-3 g-2">
                                            <li>
                                                <div class="user-card">
                                                    <div class="user-avatar sm bg-blue">
                                                        <span>CJ</span>
                                                    </div>
                                                    <div class="user-name">
                                                        <span class="tb-lead">Cooper Jones</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="kanban-item-text">
                                <p>Implement new UI design in react version @dashlite template as soon as possible.</p>
                            </div>
                            <ul class="kanban-item-tags">
                                <li><span class="badge badge-info">Dashlite</span></li>
                                <li><span class="badge badge-secondary">React</span></li>
                            </ul>
                            <div class="kanban-item-meta">
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-calendar"></em><span>5d Due</span></li>
                                    <li><em class="icon ni ni-notes"></em><span>Forntend</span></li>
                                </ul>
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-clip"></em><span>3</span></li>
                                    <li><em class="icon ni ni-comments"></em><span>5</span></li>
                                </ul>
                            </div>
                        `,
                    }]
                },
                {
                    'id': '_in_progress',
                    'title': titletemplate("In Progress","4"),
                    'class': 'kanban-primary',
                    'item': [{
                        'title':`
                            <div class="kanban-item-title">
                                <h6 class="title">Techyspec Keyword Research</h6>
                                <div class="drodown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        <div class="user-avatar-group">
                                            <div class="user-avatar xs bg-danger"><span>V</span></div>
                                        </div>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <ul class="link-list-opt no-bdr p-3 g-2">
                                            <li>
                                                <div class="user-card">
                                                    <div class="user-avatar sm bg-danger">
                                                        <span>VL</span>
                                                    </div>
                                                    <div class="user-name">
                                                        <span class="tb-lead">Victoria Lynch</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="kanban-item-text">
                                <p>Keyword recarch for @techyspec business profile and there other websites, to improve ranking.</p>
                            </div>
                            <ul class="kanban-item-tags">
                                <li><span class="badge badge-dark">Techyspec</span></li>
                                <li><span class="badge badge-success">SEO</span></li>
                            </ul>
                            <div class="kanban-item-meta">
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-calendar"></em><span>02 Jan 2021</span></li>
                                    <li><em class="icon ni ni-notes"></em><span>Recharch</span></li>
                                </ul>
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-clip"></em><span>31</span></li>
                                    <li><em class="icon ni ni-comments"></em><span>21</span></li>
                                </ul>
                            </div>
                        `,
                    },
                    {
                        'title':`
                            <div class="kanban-item-title">
                                <h6 class="title">Fitness Next Website Design</h6>
                                <div class="drodown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        <div class="user-avatar-group">
                                            <div class="user-avatar xs bg-pink"><span>P</span></div>
                                        </div>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <ul class="link-list-opt no-bdr p-3 g-2">
                                            <li>
                                                <div class="user-card">
                                                    <div class="user-avatar sm bg-pink">
                                                        <span>PN</span>
                                                    </div>
                                                    <div class="user-name">
                                                        <span class="tb-lead">Patrick Newman</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="kanban-item-text">
                                <p>Design a awesome website for @fitness_next new product launch.</p>
                            </div>
                            <ul class="kanban-item-tags">
                                <li><span class="badge badge-primary">Fitness Next</span></li>
                                <li><span class="badge badge-warning">UI Design</span></li>
                            </ul>
                            <div class="kanban-item-meta">
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-calendar"></em><span>8d Due</span></li>
                                    <li><em class="icon ni ni-notes"></em><span>Design</span></li>
                                </ul>
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-clip"></em><span>3</span></li>
                                    <li><em class="icon ni ni-comments"></em><span>5</span></li>
                                </ul>
                            </div>
                        `,
                    },{
                        'title':`
                            <div class="kanban-item-title">
                                <h6 class="title">Runnergy Website Redesign</h6>
                                <div class="drodown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        <div class="user-avatar-group">
                                            <div class="user-avatar xs bg-purple">
                                                <span>J</span>
                                            </div>
                                            <div class="user-avatar xs bg-success">
                                                <span>I</span>
                                            </div>
                                        </div>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <ul class="link-list-opt no-bdr p-3 g-2">
                                            <li>
                                                <div class="user-card">
                                                    <div class="user-avatar sm bg-purple">
                                                        <span>JH</span>
                                                    </div>
                                                    <div class="user-name">
                                                        <span class="tb-lead">Jane Harris</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="user-card">
                                                    <div class="user-avatar sm bg-success">
                                                        <span>IH</span>
                                                    </div>
                                                    <div class="user-name">
                                                        <span class="tb-lead">Iliash Hosain</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="kanban-item-text">
                                <p>Redesign there old/backdated website new modern and clean look keeping minilisim in mind.</p>
                            </div>
                            <ul class="kanban-item-tags">
                                <li><span class="badge badge-gray">Redesign</span></li>
                                <li><span class="badge badge-primary">Runnergy</span></li>
                            </ul>
                            <div class="kanban-item-meta">
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-calendar"></em><span>10 Jan 2021</span></li>
                                    <li><em class="icon ni ni-notes"></em><span>Design</span></li>
                                </ul>
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-clip"></em><span>12</span></li>
                                    <li><em class="icon ni ni-comments"></em><span>8</span></li>
                                </ul>
                            </div>
                        `,
                    },{
                        'title':`
                            <div class="kanban-item-title">
                                <h6 class="title">Wordlab Android App</h6>
                                <div class="drodown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        <div class="user-avatar-group">
                                            <div class="user-avatar xs bg-primary"><span>J</span></div>
                                        </div>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <ul class="link-list-opt no-bdr p-3 g-2">
                                            <li>
                                                <div class="user-card">
                                                    <div class="user-avatar sm bg-primary">
                                                        <span>JH</span>
                                                    </div>
                                                    <div class="user-name">
                                                        <span class="tb-lead">Jane Harris</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="kanban-item-text">
                                <p>Wordlab Android App with with react native.</p>
                            </div>
                            <ul class="kanban-item-tags">
                                <li><span class="badge badge-success">Wordlab</span></li>
                                <li><span class="badge badge-light">Android</span></li>
                            </ul>
                            <div class="kanban-item-meta">
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-calendar"></em><span>21 Jan 2021</span></li>
                                    <li><em class="icon ni ni-notes"></em><span>App</span></li>
                                </ul>
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-clip"></em><span>8</span></li>
                                    <li><em class="icon ni ni-comments"></em><span>85</span></li>
                                </ul>
                            </div>
                        `,
                    }]
                },
                {
                    'id': '_to_review',
                    'title': titletemplate("To Review","2"),
                    'class': 'kanban-warning',
                    'item': [{
                        'title':`
                            <div class="kanban-item-title">
                                <h6 class="title">Oberlo Development</h6>
                                <div class="drodown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        <div class="user-avatar-group">
                                            <div class="user-avatar xs bg-purple">
                                                <span>A</span>
                                            </div>
                                            <div class="user-avatar xs bg-success">
                                                <span>B</span>
                                            </div>
                                        </div>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <ul class="link-list-opt no-bdr p-3 g-2">
                                            <li>
                                                <div class="user-card">
                                                    <div class="user-avatar sm bg-primary">
                                                        <span>AB</span>
                                                    </div>
                                                    <div class="user-name">
                                                        <span class="tb-lead">Abu Bin Ishtiyak</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="user-card">
                                                    <div class="user-avatar sm bg-success">
                                                        <span>BA</span>
                                                    </div>
                                                    <div class="user-name">
                                                        <span class="tb-lead">Butler Alan</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="kanban-item-text">
                                <p>Complete website development for Oberlo limited.</p>
                            </div>
                            <ul class="kanban-item-tags">
                                <li><span class="badge badge-info">Oberlo</span></li>
                                <li><span class="badge badge-danger">Development</span></li>
                            </ul>
                            <div class="kanban-item-meta">
                                <ul class="kanban-item-meta-list">
                                    <li class="text-danger"><em class="icon ni ni-calendar"></em><span>1d Due</span></li>
                                    <li><em class="icon ni ni-notes"></em><span>Backend</span></li>
                                </ul>
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-clip"></em><span>16</span></li>
                                    <li><em class="icon ni ni-comments"></em><span>25</span></li>
                                </ul>
                            </div>
                        `,
                    },{
                        'title':`
                            <div class="kanban-item-title">
                                <h6 class="title">IOS app for Getsocio</h6>
                                <div class="drodown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        <div class="user-avatar-group">
                                            <div class="user-avatar xs bg-pink"><span>P</span></div>
                                        </div>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <ul class="link-list-opt no-bdr p-3 g-2">
                                            <li>
                                                <div class="user-card">
                                                    <div class="user-avatar sm bg-pink">
                                                        <span>PN</span>
                                                    </div>
                                                    <div class="user-name">
                                                        <span class="tb-lead">Patrick Newman</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="kanban-item-text">
                                <p>Design and develop app for Getsocio IOS.</p>
                            </div>
                            <ul class="kanban-item-tags">
                                <li><span class="badge badge-dark">Getsocio</span></li>
                                <li><span class="badge badge-light">IOS</span></li>
                            </ul>
                            <div class="kanban-item-meta">
                                <ul class="kanban-item-meta-list">
                                    <li class="text-danger"><em class="icon ni ni-calendar"></em><span>4d Due</span></li>
                                    <li><em class="icon ni ni-notes"></em><span>Forntend</span></li>
                                </ul>
                                <ul class="kanban-item-meta-list">
                                    <li><em class="icon ni ni-clip"></em><span>3</span></li>
                                    <li><em class="icon ni ni-comments"></em><span>5</span></li>
                                </ul>
                            </div>
                        `,
                    }]
                },
                {
                    'id': '_completed',
                    'title': titletemplate("Completed","0"),
                    'class': 'kanban-success',
                    'item': []
                }
            ]
        });
        for (var i = 0; i < kanban.options.boards.length; i++) {
            var board = kanban.findBoard(kanban.options.boards[i].id);
            $(board).find("footer").html(`<button class="kanban-add-task btn btn-block"><em class="icon ni ni-plus-sm"></em><span>Add another task</span></button>`);
        }
    };

    NioApp.coms.docReady.push(NioApp.Kanban);

})(NioApp, jQuery);