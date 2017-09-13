$(function() {
    function App(url) {
        this.api = {
            video: 'https://bangumi.bilibili.com/web_api/timeline_global',
            info: 'https://www.bilibili.com/index/catalogy/51-week.json'
        };

        return this.init();
    }

    App.prototype = {
        init: function() {
            this.el_videoList = $('#videoList'),
            this.el_loading = $('.loading'),
            this.el_errMsg = $('#errMsg'),

            this.getData(this.api.video, this.getTodayVideo);
        },

        getData: function(url, success) {
            var self = this;

            $.ajax({
                url: url,
                type: 'GET',
                success: function(res) {
                    success.call(self, res);

                    self.el_loading.hide();
                    self.el_errMsg.hide()
                },
                error: function() {
                    self.el_errMsg.text('电波发送失败啦(-_-#)').show();
                }
            })
        },

        getTodayVideo: function(res) {
            var self = this;

            console.log(res);

            if(res.code === 0) {
                res.result.forEach(function(item, index) {
                    if(item.is_today === 1) {
                        var el = self.generateDom(item);
                        self.render(el);
                    }
                });
            } else {
                self.el_errMsg.text(res.message).show();
            }
        },

        generateDom: function(data) {
            var self = this,
                dom = '';

            data.seasons.forEach(function(item, index) {
                var pubIndex = '';

                if(item.is_published === 1) {
                    pubIndex = '<p style="color: #fb7299">' + item.pub_index + '</p>';
                } else {
                    pubIndex = '<p>' + item.pub_index + '</p>';
                }

                dom += '<div class="item" id='+ item.season_id +'>' +
                                '<img src="'+ item.cover +'">' +
                                '<div class="content">' +
                                    '<p>' + item.title +
                                    '<p>' + data.date + '\t' + item.pub_time +'</p>' +
                                    pubIndex +
                                '</div>' +
                          '</div>';
            })

            return dom;
        },

        render: function(dom) {
            // var self = this;

            this.el_videoList.append(dom);

            setTimeout(function() {
                $('.item').css('opacity', 1);
            }, 100)

            this.bindClick()
        },

        bindClick: function() {
            var self = this;

            this.el_videoList.on('click', '.item', function(){
                chrome.tabs.create({
                    url: 'https://bangumi.bilibili.com/anime/' + $(this).attr('id')
                })
            })
        }
    }

    new App();
})
