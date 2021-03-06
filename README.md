# Bandr

## Description
Bandr is an application for musicians, bands, and event organizers. Upon sign up, users can create a profile of either two types ("band" or "planner"). Upon creation, the users profile will be available to match with other user profiles of the opposite type. When a user has a profile, they can search for matches as well. Users can skip through each profile individually, and when they see a potential match, they will either send a match if the opposite user hasn't already sent a match, or accept the match if the other user already sent a match. Sent and accepted matches are automatically removed from the Match queue, and users can see the profiles they've matched with in a seperate view.

## Planning Story

## Important Links

## User Stories

- As a user I want to sign up with email and password and be signed in
- As a user I want to be able to sign in if I have already signed up
- As a user I want to submit answers to a questionnaire
- As a user I want to view my answers to the questionnaire
- As a user I want to update my answers to the questionnaire
- As a user I want to delete my answers to the questionnaire
- As a user I want to view other users answers to the questionnaire
- As a user I want to skip other users answers or attempt to create a match with them
- As a user I want to match with another user if they have already tried to match with me
- As a user I want to index all of my matches
- As a user I want to be able to delete my matches
- As a user I want to be able to change my password
- As a user I want to be able to sign out


## Technologies Used
- Express
- MongoDB

## ERD
![IMG_6876](https://user-images.githubusercontent.com/80169995/120368739-6ea98b80-c2e0-11eb-849d-438af863b356.JPG)

## Problem-solving process and strategy

## Unsolved Problems

## Catalog of Routes
#### Auth
| Verb   | URI Pattern      |
|--------|------------------|
| POST   | /sign-up         |
| POST   | /sign-in         |
| DELETE | /sign-out        |
| PATCH  | /change-password |

#### Profiles
| Verb     | URI Pattern         |
|----------|---------------------|
<!-- | POST     | /questionnaire      |
| GET      | /questionnaires     |
| GET      | /questionnaires/:id |
| DELETE   | /questionnaires/:id |
| PATCH    | /questionnaires/:id | -->

#### Matches
| Verb     | URI Pattern         |
|----------|---------------------|
<!-- | POST     | /questionnaire      |
| GET      | /questionnaires     |
| GET      | /questionnaires/:id |
| DELETE   | /questionnaires/:id |
| PATCH    | /questionnaires/:id | -->
