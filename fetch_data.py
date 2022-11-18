import itertools
import os
import json
import pathlib
import click
import instaloader


L = instaloader.Instaloader()


@click.command()
@click.option("--login-user", help="Login username, you need to login with `instaloader --login` if you want to use this option")
@click.option("--target-profile", required=True, help="Profile to download data from")
@click.option("--post-count", default=3, help="How many posts to download, default is 3")
def update(login_user, target_profile: str, post_count):
    """
    load data from instagram
    """
    if login_user is not None:
        L.load_session_from_file(login_user)
    print(login_user, target_profile, post_count)

    # profile = instaloader.Profile.from_username(L.context, target_profile)
    profile = instaloader.Profile.from_username(L.context, target_profile)
    posts = profile.get_posts()

    print(posts.count)

    latest_posts = itertools.islice(posts, post_count)

    items = []

    for post in latest_posts:
        shortcode = post.shortcode

        print(post.date_utc)

        cwd = pathlib.Path(os.path.curdir)

        target_dir = cwd.joinpath("insta-data", shortcode)
        L.download_post(post, target_dir)

        thumbnail_image = None
        for file in os.listdir(target_dir):
            if file.endswith("UTC_1.jpg") or file.endswith("UTC.jpg"):
                thumbnail_image = file
                break

        items.append(dict(
            shortcode=shortcode,
            # url=post.url, # maybe we'll offer an option to use instagram cdn later
            type=post.typename,
            likes=post.likes,
            views=post.video_view_count,
            comments=post.comments,
            thumbnail_image=thumbnail_image,
        ))

    print(items)

    file = open("insta-data/data.json", 'w', 10, 'utf8')
    file.write(json.dumps(items))
    file.flush()
    file.close()


if __name__ == '__main__':
    update(None, None, None)
