# Cryptdowner
A web based optionally encrypted paste bin kind of thing. Cryptdowner processes everything client side. Nothing from the user is collected.

To use Cryptdowner just write your message in the message field and press encrypt. (If you add a password the message will be encrypted.)

Your message is compressed using https://github.com/pieroxy/lz-string/ and put in the URL. There is no backend where your data is stored it's all in the URL.
