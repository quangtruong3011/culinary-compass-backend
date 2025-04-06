export const restaurantProviders = [
  {
    provide: 'RESTAURANT_REPOSITORY',
    useFactory: (dataSource) => dataSource.getRepository('Restaurant'),
    inject: ['DATA_SOURCE'],
  },
];
