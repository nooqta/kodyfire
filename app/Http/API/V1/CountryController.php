<?php
namespace App\Http\Controllers\API\V1;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Http\Requests\CreateCountryRequest;
use App\Http\Requests\UpdateCountryRequest;
use App\Storage\DataBag;
use App\Models\Country;
use App\Repositories\CountryRepository;

class CountryController extends Controller
{
    
    public function getAll(Request  $request) {
      try {
      $configs = [];
      
      
          if (!$request->has('pagination')) {
            $data = Country::all();
            
          } else {
            $pageSize = $request->query('pageSize');
            $currentPage = $request->query('currentPage');
            $search = $request->query('search');
            Paginator::currentPageResolver(function () use ($currentPage) {
                return $currentPage;
            });
            $data = Country::paginate($pageSize);
            if($search != ""){
                $data = Country::search($search)->paginate($pageSize);
            }
            
          }
    } catch (\Throwable $th) {
      Log::error($th->getMessage());
      return response()->json([
            'error' => 'Une erreur est parvenue',
        ], 500);
    }
    return response()->json(['data' => $data,'configs' => $configs]);
          }

    public function get(Country $country)
    {
      try {
        $data = $country;
      } catch (\Throwable $th) {
        Log::error($th->getMessage());
          return response()->json([
              'error' => 'Une erreur est parvenue',
          ], 500);
      }
      return response()->json(['data' => $data]);
    }

    public function create(CreateCountryRequest $request, CountryRepository $repository)
    {
        $data = new DataBag(['data' => $request->all()]);
        try {
            $model = $repository->create($data);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
        $message = trans('app.createSuccessMsg');
        return response()->json(['data' => $model, 'message' => $message, 'success' => true]);
    }

    public function update(UpdateCountryRequest $request, Country $country, CountryRepository $repository) {
      $data = new DataBag(['data' => $request->all()]);
      try {
          $model = $repository->update($country, $data);
      } catch (\Exception $e) {
          Log::error($e->getMessage());
          return response()->json([
              'error' => $e->getMessage(),
          ], 500);
      }
      $message = trans('app.updateSuccessMsg');
      return response()->json(['data' => $model, 'message' => $message, 'success' => true]);
      }

    public function delete(Country $country) {
    try {
        
        $country->delete();
    } catch (\Exception $e) {
        Log::error($e->getMessage());
            return response()->json([
        'error' => 'Une erreur est parvenue',
        ], 500);
    }
    $message = trans('app.deleteSuccessMsg');
    return response()->json(['message' => $message], 200);
    }

}
    