import styles from './styles/Header.module.scss'

import { configService } from 'services/config'

import { Toggle } from './Toggle'

export function HomeHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.audit}>
        <p>
          Smart contracts are{' '}
          <a
            href={configService.github.auditReportUrl}
            target="_blank"
            rel="noreferrer"
          >
            audited
          </a>{' '}
          by{' '}
          <a
            href="https://blog.theori.io/about"
            target="_blank"
            rel="noreferrer"
          >
            Theori
          </a>
        </p>
      </div>

      <Toggle />
    </header>
  )
}
