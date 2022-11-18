import { Component, Prop, State, h } from '@stencil/core';

type Post = {
  shortcode: string,
  type: "GraphImage" | "GraphSidecar" | "GraphVideo",
  thumbnail_image: string,
  likes: number,
  views: number | null,
  comments: number
}

@Component({
  tag: 'open-instagram-embed',
})
export class OpenInstagramEmbed {
  @Prop() datasource: string;

  @Prop() count: number = 3;

  @State() data: Post[] | null = null;
  @State() error: string | null = null;

  async load() {
    const url = this.datasource.endsWith("/") ? this.datasource + "data.json" : this.datasource + "/data.json"
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Response code is not OK: ${response.status} ${response.statusText}`)
      }
      this.data = await response.json()
    } catch (error) {
      console.log("Failed to load data", error)
      this.error = error?.message
    }
  }

  connectedCallback() {
    this.load()
  }

  render() {
    if (this.error) {
      return <div>
        {this.error && <span>An error occured while loading dat from "{this.datasource}": {this.error}</span>}
        {
          Array(this.count).map(_ => {
            <div class="open-instagram-embed-loading-post"></div>
          })
        }
      </div>
    } else if (this.data) {
      const base_dir = this.datasource.endsWith("/") ? this.datasource : this.datasource + "/"

      return <div>
        {
          this.data.slice(0, this.count).map(post => {
            return <div class="open-instagram-embed-post" style={{ "background-image": `url('${base_dir + post.thumbnail_image}')` }}>
              <span>{post.type}</span>
              <div class="open-instagram-embed-post-hover-bg"></div>
              <div class="open-instagram-embed-post-hover-overlay">
                Likes: {post.likes} Views: {post.views} Comments: {post.comments}
              </div>
            </div>
          })
        }
      </div>
    } else {
      // is Loading
      return <div>
        {
          Array(this.count).map(_ => {
            <div class="open-instagram-embed-loading-post"></div>
          })
        }
      </div>
    }
  }
}