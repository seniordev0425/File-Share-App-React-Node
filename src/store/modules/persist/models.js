import { Record } from 'immutable'


// Intentionally omitted record name so that it errors out when
// this record is persisted mistakenly
export const State = Record({
  rehydrated: false,
})
