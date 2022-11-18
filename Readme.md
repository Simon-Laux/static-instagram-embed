# Privacy friendly static embedding of instagram to your website

This project has 2 parts, one python script that downloads/updates the data, and one webcomponent that you can eaialy embed into your website

## Embed Webcomponent into your website

// TODO

## Downloading Data

install dependencies
```
pip3 install instaloader
pip3 install click
```


Then run the updater function (you can put it into a cronjob somewhere):
```
python fetch_data.py --target-profile username
```
replace `username` with the name of your profile


Sometimes it can make sense to login to:
- download a private profile
- increase successrate from a public server that might be blocked by instagram

To do that you first need to login
```
instaloader --login username
```
replace `username` with the name of your profile.

and then modify the command from above like this
```
python fetch_data.py --login-user username --target-profile username
```
replace `username` with the name of your profile.
