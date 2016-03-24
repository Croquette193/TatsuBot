var Cleverbot = require('cleverbot-node');
var Slave = new Cleverbot();
var ent = require('entities');

exports.cleverbot = function(bot, msg) {
	var text = (msg.cleanContent.split(' ').length > 1) ? msg.cleanContent.substring(msg.cleanContent.indexOf(' ') + 1).replace('@', '') : false;
	if (text) {
		bot.startTyping(msg.channel);
		Cleverbot.prepare(function() {
			try {
				Slave.write(text, function(resp) {
					if (/\|/g.test(resp.message)) {
						resp.message = resp.message.replace(/\|/g, '\\u'); //replace | with \u
						resp.message = resp.message.replace(/\\u([\d\w]{4})/gi, function(match, grp) { //unescape unicode
							return String.fromCharCode(parseInt(grp, 16));
						});
					}
					if (!resp.message || !ent.decodeHTML(resp.message)) {
						bot.sendMessage(msg, '⚠ Nothing was returned! Resetting cleverbot...');
						delete require.cache[require.resolve("cleverbot-node")];
						Cleverbot = require('cleverbot-node');
						Slave = new Cleverbot();
						console.log(colors.cWarn(" WARN ") + "Cleverbot returned nothing");
					} else bot.sendMessage(msg, '💬 ' + ent.decodeHTML(resp.message));
				});
			} catch (error) { bot.sendMessage(msg, '⚠ There was an error', function(erro, wMessage) { bot.deleteMessage(wMessage, {'wait': 8000}); }); }
		});
		bot.stopTyping(msg.channel);
	} else { bot.sendMessage(msg, 'Yes?'); }
};
