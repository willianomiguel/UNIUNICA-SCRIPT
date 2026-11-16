import { type RoutePayload } from 'integracore-sdk/define';

export type SlackRouteBody = Pick<RoutePayload<unknown>, 'body'>;
