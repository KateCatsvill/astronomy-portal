import {
    useGetRelayListQuery,
    useGetRelayStateQuery,
    useSetRelayStatusMutation
} from '@/api/api'
import { useAppSelector } from '@/api/hooks'
import { IRelaySet } from '@/api/types'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Button, Dimmer, Loader, Message } from 'semantic-ui-react'

import styles from './styles.module.sass'

type TRelayListItemProps = {
    index: number
    name: string
    status: boolean
    loading: boolean
    auth: boolean
    handleClick?: (data: IRelaySet) => void
}

const RelayListItem: React.FC<TRelayListItemProps> = (props) => {
    const { index, name, status, loading, auth, handleClick } = props
    const switchClass: string = status ? 'on' : 'off'

    return (
        <div className={styles.item}>
            <div className={styles.name}>
                <span className={styles[status ? 'ledOn' : 'ledOff']} />
                {name}
            </div>
            <Button
                loading={loading}
                className={styles[status ? 'switchOn' : 'switchOff']}
                disabled={loading || !auth}
                onClick={() =>
                    handleClick?.({ index: index, state: status ? 0 : 1 })
                }
                size={'mini'}
            >
                {switchClass}
            </Button>
        </div>
    )
}

const RelayList: React.FC = () => {
    const { data: relayList, isError, isLoading } = useGetRelayListQuery()
    const { data: relayState, isFetching: loaderState } = useGetRelayStateQuery(
        null,
        { pollingInterval: 15 * 1000 }
    )
    const [setRelayStatus, { isLoading: loaderSet }] =
        useSetRelayStatusMutation()
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const user = useAppSelector((state) => state.auth)

    useEffect(() => {
        if (isAuth !== user.status) setIsAuth(user.status)
    }, [user, isAuth])

    return isLoading ? (
        <div className={classNames(styles.relayList, 'box', 'loader')}>
            <Dimmer active>
                <Loader />
            </Dimmer>
        </div>
    ) : isError || relayList === undefined || !relayList.status ? (
        <Message
            error
            content={'Возникла ошибка при получении списка управляемых реле'}
        />
    ) : (
        <div className={classNames(styles.relayList, 'box')}>
            {isAuth && relayState?.status === false && (
                <Dimmer active>
                    <Message
                        error
                        icon={'warning sign'}
                        header={'Ошибка получения состояния реле'}
                        content={
                            'Контроллер обсерватории не отвечает на запрос'
                        }
                    />
                </Dimmer>
            )}
            {relayList.payload.map((item, key) => (
                <RelayListItem
                    key={key}
                    index={key}
                    name={item}
                    status={
                        relayState?.status === true
                            ? relayState?.payload[key]
                            : false
                    }
                    // loading={(!isSuccess && isFetching) ||
                    // (relayState?.status === true && typeof relayState?.payload[key] === 'undefined')}
                    loading={loaderState || loaderSet}
                    auth={isAuth && relayState?.status === true}
                    handleClick={async (relay) => await setRelayStatus(relay)}
                />
            ))}
        </div>
    )
}

export default RelayList
