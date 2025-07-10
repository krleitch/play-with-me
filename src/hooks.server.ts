import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { SECRET_EMAIL, SECRET_PASSWORD } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	const url = 'http://127.0.0.1:8090';
	event.locals.pb = new PocketBase(url);
	await event.locals.pb.admins.authWithPassword(SECRET_EMAIL, SECRET_PASSWORD);

	const response = await resolve(event);
	return response;
};
