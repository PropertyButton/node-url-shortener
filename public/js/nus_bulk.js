(function ($) {
  var _nus = function (data) {
    this._api_ = '/api/v1/shorten/';
    this._form_ = '#nus';
    this._errormsg_ = 'An error occurred shortening that link';
  };

  _nus.prototype.init = function () {
    var self = this;
    self._input_ = $(self._form_).find('textarea');
    self._prefix_ = $(self._form_).find('input').val();

    var _rows_ = self._input_.val().split("\n");

    self._input_.val('');

    $.each(_rows_, function(row, id){
      var _id_ = id;
      var _url_ = self._prefix_ + _id_
      if (!self.check(_url_)) {
        return self._input_.val(self._input_.val() + _id_ + ',' + _url_ + ',' + self._errormsg_ + '\n');
      }
      self.request(_url_, function(error, resp){
        if(error){
          return self._input_.val(self._input_.val() + _id_ + ',' + _url_ + ',' + error + '\n');
        } else {
          return self._input_.val(self._input_.val() + _id_ + ',' + _url_ + ',' + resp + '\n');
        }
      });
    });
  };

  _nus.prototype.check = function (s) {
    var regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
  };

  _nus.prototype.request = function (url, callback) {
    var self = this;
    $.post(self._api_, { long_url: url }, function (data) {
      if (data.hasOwnProperty('status_code') && data.hasOwnProperty('status_txt')) {
        if (parseInt(data.status_code) == 200) {
          callback(null, data.short_url);
        } else {
          callback(data.status_txt);
        }
      }
    }).error(function(){
      callback(self._errormsg_)
    });
  };

  $(function () {
    var n = new _nus();

    $(n._form_).on('submit', function (e) {
      e && e.preventDefault();
      n.init();
    });
  });

})(window.jQuery);
