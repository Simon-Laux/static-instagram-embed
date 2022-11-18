# Privacy friendly static embedding of instagram to your website

This project has 2 parts, one python script that downloads/updates the data, and one webcomponent that you can easialy embed into your website.

## Embed Webcomponent into your website

download `open-instagram-embed.js` from the releases.

```html
<script src="open-instagram-embed.js"></script>

<open-instagram-embed datasource="url-to/insta-data" count="3"></open-instagram-embed>
```

Arguments:
- `datasource` - point this to the "insta-data" directory that `fetch_data.py` generated. This can be even on a different server as long as you set the CORS headers correctly on the server serving the "insta-data" directory.
- `count` - how many posts to display, default is 3. If you want more posts you also need to increase the number of posts downloaded with the `fetch_data.py` script with the `--post-count` flag.

### Compile it yourself

```
cd open-instagram-embed
npm install
npm run build
```

now copy `open-instagram-embed/dist/components/open-instagram-embed.js` to your project!

## Downloading Data

install dependenciesn allnighter ;)
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


```sh
$ python fetch_data.py --help
Usage: fetch_data.py [OPTIONS]

  load data from instagram

Options:
  --login-user TEXT      Login username, you need to login with
                         `instaloader --login` if you want to use this option
  --target-profile TEXT  Profile to download data from  [required]
  --post-count INTEGER   How many posts to download, default is 3
  --help                 Show this message and exit.
```


## Thanks to

### instaloader for fetching the data from instagram
https://github.com/instaloader/instaloader

### Fontawesome for the icons
Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - 
            https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code:
             MIT License) Copyright 2022 Fonticons, Inc.

### Stencil for making Webcomponents easy
https://stenciljs.com/