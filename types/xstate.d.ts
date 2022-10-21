type StateNodeConfig = import('xstate').StateNodeConfig

declare type StateType<T> = StateNodeConfig<T, any, any>['type']
