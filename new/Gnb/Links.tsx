import { memo } from 'react'

import { configService } from 'services/config'

function Links() {
  return (
    <nav>
      <ul>
        <li>
          <a href={configService.docs.notion} target="_blank" rel="noopener">
            blog
          </a>
        </li>
        <li>
          <a
            href={configService.socialMedia.medium}
            target="_blank"
            rel="noopener"
          >
            medium
          </a>
        </li>
        <li>
          <a
            href={configService.github.repositoryUrl}
            target="_blank"
            rel="noopener"
          >
            github
          </a>
        </li>
        <li>
          <a target="_blank" rel="noopener">
            FAQ
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default memo(Links)
