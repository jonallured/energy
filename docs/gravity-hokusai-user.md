# How to give CMS access to the folio test partner

If you get something like this when trying to access the CMS either in production on staging, you probably need to set the partner subscription state to active
![Screen Shot 2022-09-13 at 15 55 18](https://user-images.githubusercontent.com/36475005/189931131-79c6ed9c-2b68-4f19-bbd7-be073f467dab.png)

## How to do that?

- Most of our backend repos use a tool called hokusai for managing environments you can use to get into a rails console for rails services. If you need to set up hokusai you can check [this](https://github.com/artsy/README/blob/main/playbooks/hokusai.md#setup) 
- Go to your local gravity repo, and assuming you have hokusai + dependencies setup you can run:
```
 hokusai staging run "bundle exec rails c -- --nomultiline" --tty  
```

once this is active you can set the partner subscription state to **active**

```
gravity:staging> partner = Partner.find_by(display_name: "Folio Test Partner")
gravity:staging> partner.update! subscription_state: 'active'
```
