$(function() {
    "use strict"

    function App() {
        this.api = {
            video: 'https://bangumi.bilibili.com/web_api/timeline_global',
            info: 'https://www.bilibili.com/index/catalogy/51-week.json'
        };

        this.el_videoList = $('#videoList');
        this.el_infoList = $('#infoList');
        this.el_loading = $('.loading');
        this.el_errMsg = $('#errMsg');
        this.el_button = $('#toolbar button');

        return this.init();
    }

    App.prototype = {
        init: function() {
            this.getData(this.api.video, this.getTodayVideo);
            this.getData(this.api.info, this.getInfoListData);
            this.bindClick();
        },

        getData: function(url, success) {
            var self = this;

            $.ajax({
                url: url,
                type: 'GET',
                success: function(res) {
                    self.el_loading.hide();

                    success.call(self, res);
                },
                error: function() {
                    self.el_errMsg.text('电波发送失败啦(-_-#)').show();
                }
            })
        },

        getTodayVideo: function(data) {
            var self = this;

            if(data.code === 0) {
                self.el_errMsg.hide()

                data.result.forEach(function(item, index) {
                    if(item.is_today === 1) {
                        self.generateVideoDom(item);
                    }
                });
            } else {
                self.el_errMsg.text(data.message).show();
            }
        },

        getInfoListData: function(data) {
            var self = this;

            if(data.hot.code === 0) {
                self.el_errMsg.hide()

                self.generateInfoDom(data.hot.list);
            } else {
                self.el_errMsg.text('欢声笑语打出GG').show()
            }
        },

        generateVideoDom: function(data) {
            var self = this;
            let dom = '';

            data.seasons.forEach(function(item, index) {
                let pubIndex = '';

                if(item.is_published === 1) {
                    pubIndex = '<p style="color: #fb7299">' + item.pub_index + '</p>';
                } else {
                    pubIndex = '<p style="color: #999">' + item.pub_index + '</p>';
                }

                dom += `<div class="item" id= ${item.season_id}>
                            <img src="${item.cover}">
                            <div class="content">
                                <p>${item.title}</p>
                                <p>${data.date}\t${item.pub_time}</p>
                                ${pubIndex}
                            </div>
                        </div>`;
            })

            self.render(dom, self.el_videoList);
        },

        generateInfoDom: function(data) {
            var self = this;
            let dom = '';

            data.forEach(function(item, index) {
                dom += `<div class="item" id= ${item.aid}>
                            <img src="${item.pic}">
                            <div class="content">
                                <p>${item.title}</p>
                            </div>
                        </div>`;
            })

            self.render(dom, self.el_infoList);
        },

        render: function(dom, box) {
            box.empty().append(dom);

            setTimeout(() => $('.item').css('opacity', 1), 100)
        },

        createTab: function(url) {
            chrome.tabs.create({
                url: url
            })
        },

        bindClick: function() {
            var self = this;

            this.el_videoList.on('click', '.item', function(){
                self.createTab('https://bangumi.bilibili.com/anime/' + $(this).attr('id'))
            })

            this.el_infoList.on('click', '.item', function(){
                self.createTab('https://www.bilibili.com/video/av' + $(this).attr('id'))
            })

            this.el_button.each(function(index, button){
                $(button).on('click', function() {
                    $('#' + $(this).attr('data-tab')).show();
                    $('#' + $(this).attr('data-tab')).siblings().hide()

                    $(this).css({
                        'color': '#fff',
                        'border-color': '#fb7299',
                        'background-color': '#fb7299'
                    })

                    $(this).siblings().css({
                        'color': '#999',
                        'border-color': '#ddd',
                        'background-color': '#fff'
                    })
                })
            });
        }
    }

    new App();
})
