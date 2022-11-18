import { Component, Prop, State, h, Watch, Host } from '@stencil/core';

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
  styleUrl: 'open-instagram-embed.css',
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

  @Watch('datasource')
  watchPropHandler(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.load()
    }
  }

  connectedCallback() {
    this.load()
  }

  render() {
    if (this.error) {
      return <Host>
        {this.error && <span>An error occured while loading data from "{this.datasource}": {this.error}</span>}
        
        <div class="open-instagram-embed-grid">
          {
            new Array(this.count).fill(0).map(_ => {
             return <div class="open-instagram-embed-loading-post"></div>
            })
          }
        </div>
      </Host>
    } else if (this.data) {
      const base_dir = this.datasource.endsWith("/") ? this.datasource : this.datasource + "/"

      return <Host>
        <div class="open-instagram-embed-grid">
        {
          this.data.slice(0, this.count).map(post => {
            const link = `https://www.instagram.com/p/${post.shortcode}`
            return <a class="open-instagram-embed-post" style={{ "background-image": `url('${base_dir + post.thumbnail_image}')` }} href={link}>
              <span class="open-instagram-embed-post-type-icon">{post.type}</span>
              <div class="open-instagram-embed-post-hover-bg"></div>
              <div class="open-instagram-embed-post-hover-overlay">
                <div class="open-instagram-embed-post-hover-overlay-details">
                  Likes: {post.likes} Views: {post.views} Comments: {post.comments}
                </div>
              </div>
            </a>
          })
        }
        </div>
      </Host>
    } else {
      // is Loading
      return <Host>
        <div class="open-instagram-embed-grid">
        {
          Array(this.count).map(_ => {
            return <div class="open-instagram-embed-loading-post"></div>
          })
        }
        </div>
      </Host>
    }
  }
}