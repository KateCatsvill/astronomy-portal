import { TNews } from '@/api/types'
import classNames from 'classnames'
import moment from 'moment'
import React from 'react'
import { Icon, Image } from 'semantic-ui-react'

import avatar from '@/public/images/avatar.jpg'

import NewsPhotos from './NewsPhotos'
import styles from './styles.module.sass'

type TNewsItemProps = {
    news: TNews
}

const NewsItem: React.FC<TNewsItemProps> = (props) => {
    const { news } = props

    const currentMobile: boolean =
        typeof window !== 'undefined' ? window.innerWidth <= 760 : false

    // #TODO Use this
    // const urlify = (text: string) =>
    //     text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')

    return (
        <div className={classNames(styles.item, 'box')}>
            <div className={styles.header}>
                <Image
                    avatar
                    src={avatar.src}
                    className={styles.avatar}
                />
                <div>
                    <a
                        href={`//vk.com/${news.link}`}
                        title='Обсерватория'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        Обсерватория
                    </a>
                    <div className={styles.info}>
                        {moment.unix(news.date).format('DD MMMM Y в H:mm')}
                        {!currentMobile && (
                            <>
                                <span className={styles.divider} />
                                <Icon name='eye' /> {news.views}
                                <span className={styles.divider} />
                                <Icon name='like' /> {news.likes}
                                <span className={styles.divider} />
                                <Icon name='reply' /> {news.reposts}
                                <span className={styles.divider} />
                                <Icon name='comment' /> {news.comments}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <p className={styles.text}>{news.text}</p>
            {news.photos && <NewsPhotos photos={news.photos} />}
        </div>
    )
}

export default NewsItem