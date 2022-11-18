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

              let typeIcon;
              if (post.type === "GraphSidecar") {
                typeIcon = <FontAwesomeIcon icon="images" className="open-instagram-embed-post-type-icon" />
              } else if (post.type === "GraphVideo") {
                typeIcon = <FontAwesomeIcon icon="play" className="open-instagram-embed-post-type-icon" label="Video" />
              }

              let seccondDataEntry = post.views ?
                [<FontAwesomeIcon icon="play" className="open-instagram-embed-icon" label='Views' />, <p>{post.views}</p>] :
                [<FontAwesomeIcon icon="comment" className="open-instagram-embed-icon" label='Comments' />, <p>{post.comments}</p>]

              return <a class="open-instagram-embed-post" style={{ "background-image": `url('${base_dir + post.thumbnail_image}')` }} href={link}>
                {typeIcon}
                <div class="open-instagram-embed-post-hover-bg"></div>
                <div class="open-instagram-embed-post-hover-overlay">
                  <div class="open-instagram-embed-post-hover-overlay-details">
                    <FontAwesomeIcon icon="heart" className="open-instagram-embed-icon" label='Likes' /> <p>{post.likes}</p> {seccondDataEntry}
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

/* Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - 
    https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code:
     MIT License) Copyright 2022 Fonticons, Inc. */
const FontAwesomeIcons = {
  "heart": { viewBox: "0 0 512 512", path: "M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z" },
  "comment": { viewBox: "0 0 640 512", path: "m 255.1022,32 c 141.4,0 255.9728,93.1 255.9728,208 0,49.63 -21.35,94.98 -56.97,130.7 12.5,50.37 54.27,95.27 54.77,95.77 2.25,2.25 2.875,5.734 1.5,8.734 -1.2518,2.996 -4.0228,4.796 -7.2728,4.796 -66.25,0 -115.1,-31.76 -140.6,-51.39 -32.6,12.29 -69,19.39 -107.4,19.39 C 113.7022,448 0.00219587,354.87 0.00219587,240 0.00219587,125.13 113.7022,32 255.1022,32 Z" },
  "play": { viewBox: "0 0 384 512", path: "M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" },
  "images": { viewBox: "0 0 576 512", path: "M512 32H160c-35.35 0-64 28.65-64 64v224c0 35.35 28.65 64 64 64H512c35.35 0 64-28.65 64-64V96C576 60.65 547.3 32 512 32zM528 320c0 8.822-7.178 16-16 16h-16l-109.3-160.9C383.7 170.7 378.7 168 373.3 168c-5.352 0-10.35 2.672-13.31 7.125l-62.74 94.11L274.9 238.6C271.9 234.4 267.1 232 262 232c-5.109 0-9.914 2.441-12.93 6.574L176 336H160c-8.822 0-16-7.178-16-16V96c0-8.822 7.178-16 16-16H512c8.822 0 16 7.178 16 16V320zM224 112c-17.67 0-32 14.33-32 32s14.33 32 32 32c17.68 0 32-14.33 32-32S241.7 112 224 112zM456 480H120C53.83 480 0 426.2 0 360v-240C0 106.8 10.75 96 24 96S48 106.8 48 120v240c0 39.7 32.3 72 72 72h336c13.25 0 24 10.75 24 24S469.3 480 456 480z" },
}


function FontAwesomeIcon({ icon, className, label }: { icon: keyof typeof FontAwesomeIcons, className: string, label?: string }) {
  const { viewBox, path } = FontAwesomeIcons[icon]
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} class={className} aria-label={label}>
    <path d={path} />
  </svg >
}