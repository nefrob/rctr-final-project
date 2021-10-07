const appReducer = (state, action) => {
    switch (action.type) {
        case "SET_FACTORY":
            return { ...state, factory: action.payload };
        case "ADD_TOKEN":
            return {
                ...state,
                tokens: {
                    ...state.tokens,
                    ...action.payload,
                },
            };
        case "ADD_EXCHANGE":
            return {
                ...state,
                exchanges: {
                    ...state.exchanges,
                    [action.payload.token]: action.payload.contract,
                },
            };
        case "SET_ACCOUNT":
            return { ...state, account: action.payload };
        case "SET_ETH_BALANCE":
            return {
                ...state,
                account: { ...state.account, balance: action.payload },
            };
        case "SET_TOKEN_BALANCE":
            return {
                ...state,
                tokens: {
                    ...state.tokens,
                    [action.payload.symbol]: {
                        ...state.tokens[action.payload.symbol],
                        balance: action.payload.balance,
                    },
                },
            };
        default:
            return state;
    }
};

export default appReducer;
