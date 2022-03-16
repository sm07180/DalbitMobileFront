import { createStore, applyMiddleware , AnyAction} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/index';
import rootSagas from './sagas/index';

const bindMiddleware = (middleware) => {
  //if (process.env.DEV_TOOL === 'true') {
  const { composeWithDevTools } = require('@redux-devtools/extension');
  return composeWithDevTools(applyMiddleware(...middleware));
  // }
  // return applyMiddleware(...middleware);
};

//  router: routerReducer, session, bridge, config, wedding, view
const hydrateReducer = (state, action) => {
  return rootReducer(state, action)
}


function configureStore (context) {
  const sagaMiddleware = createSagaMiddleware();
  let initialState = {};
  const store = createStore(
    hydrateReducer,
    initialState,
    bindMiddleware([sagaMiddleware])
  );
  store.sagaTask = sagaMiddleware.run(rootSagas);
  return store;
}

const store = configureStore({debug:true});
export default store;
