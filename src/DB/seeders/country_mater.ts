exports.seed = function(knex) {
    return knex('country_master').del()
      .then(function () {
        return knex('country_master').insert([
          {country_name: 'India' },
          {country_name: 'US' },
        ]);
      });
  };
  